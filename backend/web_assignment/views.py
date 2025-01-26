import json
import math

from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import PmidKeywords
from .serializers import PmidKeywordsSerializer


class FinderAPI(APIView):
    def get(self, request, pmid):
        try:
            row = PmidKeywords.objects.get(pmid=int(pmid))
            serializer = PmidKeywordsSerializer(row)
            data = serializer.data

            # NaN, inf, -inf 값을 확인하고 0 또는 다른 적절한 값으로 대체 (id 25811359 이슈)
            def replace_invalid_values(obj):
                if isinstance(obj, dict):
                    return {k: replace_invalid_values(v) for k, v in obj.items()}
                elif isinstance(obj, list):
                    return [replace_invalid_values(v) for v in obj]
                elif isinstance(obj, float) and (math.isnan(obj) or math.isinf(obj)):
                    return 0  # NaN 또는 Inf를 0으로 대체
                return obj

            safe_data = replace_invalid_values(data)

            return Response(safe_data)
        except PmidKeywords.DoesNotExist:
            return JsonResponse({"error": "PMID not found."}, status=404)
        except Exception as e:
            print("Error:", e)
            return JsonResponse({"error": str(e)}, status=400)


class ManagerAPI(APIView):
    def post(self, request):
        serializer = PmidKeywordsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Data inserted successfully!"})
        return Response(serializer.errors, status=400)

    def delete(self, request, pmid):
        try:
            data = PmidKeywords.objects.get(pmid=pmid)
            data.delete()
            return Response({"message": "Data deleted successfully!"})
        except PmidKeywords.DoesNotExist:
            return JsonResponse({"error": "PMID not found"}, status=404)


class UpdateAPI(APIView):
    def put(self, request, pmid):
        try:
            data = json.loads(request.body)
            action = data.get("action")
            keyword = data.get("keyword")

            if not action or not keyword:
                return JsonResponse({"error": "Invalid request data."}, status=400)

            row = PmidKeywords.objects.get(pmid=pmid)
            keyword_info = row.keyword_info

            if isinstance(keyword_info, list) and len(keyword_info) > 0:
                keyword_info_dict = keyword_info[0]
            else:
                return JsonResponse(
                    {"error": "Keyword info is empty or invalid."}, status=400
                )

            original_text = keyword_info_dict["text"]

            if action == "add":
                keyword_info_dict["annotations"].append(keyword)
            elif action == "delete":
                keyword_info_dict["annotations"] = [
                    anno for anno in keyword_info_dict["annotations"] if anno != keyword
                ]
            elif action == "update":
                for anno in keyword_info_dict["annotations"]:
                    if anno["span"] == keyword["span"]:
                        anno.update(keyword)
                        break
            else:
                return JsonResponse({"error": "Invalid action type."}, status=400)

            # 업데이트된 텍스트 생성
            updated_text = list(original_text)
            annotations_sorted = sorted(
                keyword_info_dict["annotations"], key=lambda x: x["span"]["begin"]
            )
            for anno in reversed(annotations_sorted):  # 역순으로 처리
                span = anno["span"]
                mention = anno["mention"]
                updated_text[span["begin"] : span["end"]] = list(mention)
            keyword_info_dict["text"] = "".join(updated_text)

            row.keyword_info[0] = keyword_info_dict
            row.save()

            return JsonResponse(
                {
                    "message": "Data updated successfully!",
                    "updated_data": row.keyword_info,
                    "updated_text": keyword_info_dict["text"],
                },
                status=200,
            )

        except PmidKeywords.DoesNotExist:
            return JsonResponse({"error": "PMID not found."}, status=404)
        except Exception as e:
            print("Error:", e)
            return JsonResponse({"error": str(e)}, status=400)
