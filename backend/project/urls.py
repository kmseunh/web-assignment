from django.urls import path

from web_assignment.views import FinderAPI, ManagerAPI, UpdateAPI

urlpatterns = [
    path("api/finder/<int:pmid>/", FinderAPI.as_view(), name="finder"),
    path("api/manager/", ManagerAPI.as_view(), name="manager"),
    path("api/manager/<int:pmid>/", ManagerAPI.as_view(), name="delete_manager"),
    path("api/update/<int:pmid>/", UpdateAPI.as_view(), name="update_manager"),
]
