import { useState } from 'react';
import Header from './components/Header';
import FinderComponent from './components/FinderComponent';
import ManagerComponent from './components/ManagerComponent';

const App = () => {
    const [activeComponent, setActiveComponent] = useState('Finder');

    const renderComponent = () => {
        if (activeComponent === 'Finder') {
            return <FinderComponent />;
        } else if (activeComponent === 'Manager') {
            return <ManagerComponent />;
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                width: '100vw',
            }}
        >
            <Header
                activeComponent={activeComponent}
                setActiveComponent={setActiveComponent}
            />
            <main
                style={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '40px',
                    backgroundColor: '#f4f4f9',
                }}
            >
                <div
                    style={{
                        background: 'white',
                        padding: '40px',
                        borderRadius: '10px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        width: '80%',
                        maxWidth: '800px',
                    }}
                >
                    {renderComponent()}
                </div>
            </main>
        </div>
    );
};

export default App;
