import { useState } from 'react';
import axios from 'axios';

const ManagerComponent = () => {
    const [pmid, setPmid] = useState('');
    const [keywordInfo, setKeywordInfo] = useState('');
    const [message, setMessage] = useState('');

    const handleInsert = async () => {
        setMessage('');
        if (!pmid || !keywordInfo) {
            setMessage('PMID와 Keyword 정보를 모두 입력하세요.');
            return;
        }

        try {
            const parsedKeywordInfo = JSON.parse(keywordInfo);
            await axios.post('http://127.0.0.1:8000/api/manager/', {
                pmid,
                keyword_info: parsedKeywordInfo, // JSON 형태로 전달
            });

            setMessage('데이터가 성공적으로 삽입되었습니다.');
        } catch (error) {
            console.error(error);
            setMessage('삽입 중 에러가 발생했습니다. JSON 형식을 확인하세요.');
        }
    };

    const handleDelete = async () => {
        setMessage('');
        if (!pmid) {
            setMessage('PMID를 입력하세요.');
            return;
        }

        try {
            await axios.delete(`http://127.0.0.1:8000/api/manager/${pmid}/`);
            setMessage('데이터가 성공적으로 삭제되었습니다.');
        } catch (error) {
            console.error(error);
            setMessage('삭제 중 에러가 발생했습니다.');
        }
    };

    return (
        <div>
            <div style={{ marginTop: '20px' }}>
                <label>PMID: </label>
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
                        backgroundColor: '#fff',
                        color: '#000',
                    }}
                />
            </div>

            <div style={{ marginTop: '20px' }}>
                <label>Keyword JSON: </label>
                <textarea
                    value={keywordInfo}
                    onChange={(e) => setKeywordInfo(e.target.value)}
                    rows='10'
                    cols='50'
                    style={{
                        display: 'block',
                        marginTop: '10px',
                        width: '800px',
                        border: '1px solid #ccc',
                        borderRadius: '5px',
                        backgroundColor: '#fff',
                        color: '#000',
                    }}
                />
            </div>

            <div style={{ marginTop: '10px' }}>
                <button
                    onClick={handleInsert}
                    style={{ padding: '10px', marginRight: '10px' }}
                >
                    Insert
                </button>
                <button onClick={handleDelete} style={{ padding: '10px' }}>
                    Delete
                </button>
            </div>

            {message && (
                <div style={{ marginTop: '20px', color: 'green' }}>
                    {message}
                </div>
            )}
        </div>
    );
};

export default ManagerComponent;
