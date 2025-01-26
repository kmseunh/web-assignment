import { useState } from 'react';
import axios from 'axios';

const FinderComponent = () => {
    const [pmid, setPmid] = useState('');
    const [text, setText] = useState('');
    const [annotations, setAnnotations] = useState([]);
    const [error, setError] = useState('');
    const [selectedAnnotation, setSelectedAnnotation] = useState(null);
    const [editMention, setEditMention] = useState('');

    // obj 색상 매핑
    const colorMapping = {
        disease: 'red',
        gene: 'yellow',
        DNA: 'blue',
        cell_line: 'skyblue',
        cell_type: 'green',
        species: 'orange',
        drug: 'purple',
        default: 'gray',
    };

    // PMID 검색
    const fetchPMIDData = async () => {
        setError('');
        try {
            const response = await axios.get(
                `http://127.0.0.1:8000/api/finder/${pmid}/`
            );
            console.log(response.data); // 데이터 확인

            const keywordInfo = response.data.keyword_info[0];

            if (keywordInfo) {
                setText(keywordInfo.text);
                setAnnotations(
                    keywordInfo.annotations.sort(
                        (a, b) => a.span.begin - b.span.begin
                    )
                );
            } else {
                setError('No keyword information found for the given PMID.');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to fetch data. Please check the PMID.');
        }
    };

    // 하이라이트된 텍스트 생성
    const getHighlightedText = (text, annotations) => {
        let highlighted = [];
        let lastIndex = 0;

        annotations.forEach((anno, index) => {
            const { begin, end } = anno.span;
            const color = colorMapping[anno.obj] || colorMapping.default;

            // 하이라이트 전 텍스트 추가
            if (begin > lastIndex) {
                highlighted.push(text.slice(lastIndex, begin));
            }

            // 하이라이트된 텍스트 추가
            highlighted.push(
                <span
                    key={index}
                    style={{
                        backgroundColor: color,
                        padding: '2px 4px',
                        borderRadius: '3px',
                        margin: '0 2px',
                        cursor: 'pointer',
                    }}
                    onClick={() => handleAnnotationClick(index)}
                >
                    {text.slice(begin, end)}
                </span>
            );

            lastIndex = end;
        });

        highlighted.push(text.slice(lastIndex));
        return highlighted;
    };

    // 키워드 클릭 시 수정 상태로 전환
    const handleAnnotationClick = (index) => {
        const selected = annotations[index];
        setSelectedAnnotation({ ...selected, index });
        setEditMention(selected.mention);
    };

    // 키워드 수정
    const handleUpdateKeyword = async () => {
        if (!selectedAnnotation) return;

        try {
            const updatedAnnotations = [...annotations];
            updatedAnnotations[selectedAnnotation.index].mention = editMention;

            await axios.put(`http://127.0.0.1:8000/api/update/${pmid}/`, {
                action: 'update',
                keyword: {
                    ...selectedAnnotation,
                    mention: editMention,
                },
            });

            setAnnotations(updatedAnnotations);
            setSelectedAnnotation(null);
            setEditMention('');
        } catch (err) {
            console.error(err);
            setError('Failed to update keyword.');
        }
    };

    // 키워드 삭제
    const handleDeleteKeyword = async () => {
        if (!selectedAnnotation) return;

        try {
            const updatedAnnotations = annotations.filter(
                (_, idx) => idx !== selectedAnnotation.index
            );

            await axios.put(`http://127.0.0.1:8000/api/update/${pmid}/`, {
                action: 'delete',
                keyword: selectedAnnotation,
            });

            setAnnotations(updatedAnnotations);
            setSelectedAnnotation(null);
            setEditMention('');
        } catch (err) {
            console.error(err);
            setError('Failed to delete keyword.');
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2 style={{ marginBottom: '20px' }}>Finder</h2>

            {/* PMID 입력 및 검색 */}
            <div style={{ marginBottom: '20px' }}>
                <label style={{ color: 'black', marginRight: '10px' }}>
                    PMID:
                </label>
                <input
                    type='text'
                    value={pmid}
                    onChange={(e) => setPmid(e.target.value)}
                    style={{
                        padding: '10px',
                        marginRight: '10px',
                        border: '1px solid #ccc',
                        borderRadius: '5px',
                        width: '300px',
                        backgroundColor: '#f9f9f9',
                        color: 'black',
                    }}
                />
                <button
                    onClick={fetchPMIDData}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                >
                    Search
                </button>
            </div>

            {error && (
                <div style={{ color: 'red', marginTop: '20px' }}>{error}</div>
            )}

            {/* 텍스트와 하이라이트 */}
            <h3>Text:</h3>
            {text && (
                <div
                    style={{
                        marginTop: '20px',
                        padding: '20px',
                        border: '1px solid #ccc',
                        borderRadius: '5px',
                        backgroundColor: '#f9f9f9',
                        color: 'black',
                        lineHeight: '1.6',
                    }}
                >
                    <p>{getHighlightedText(text, annotations)}</p>
                </div>
            )}

            {/* 수정 및 삭제 */}
            {selectedAnnotation && (
                <div style={{ marginTop: '20px' }}>
                    <h4>Edit Keyword</h4>
                    <label>Mention:</label>
                    <input
                        type='text'
                        value={editMention}
                        onChange={(e) => setEditMention(e.target.value)}
                        style={{
                            padding: '10px',
                            marginLeft: '10px',
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            backgroundColor: '#f9f9f9',
                            color: 'black',
                        }}
                    />
                    <button
                        onClick={handleUpdateKeyword}
                        style={{
                            padding: '10px',
                            marginLeft: '10px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                        }}
                    >
                        Update
                    </button>
                    <button
                        onClick={handleDeleteKeyword}
                        style={{
                            padding: '10px',
                            marginLeft: '10px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                        }}
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
};

export default FinderComponent;
