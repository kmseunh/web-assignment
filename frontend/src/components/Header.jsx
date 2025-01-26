const Header = ({ activeComponent, setActiveComponent }) => {
    return (
        <header
            style={{
                background: '#e0e0e0',
                padding: '30px',
                display: 'flex',
                alignItems: 'center',
            }}
        >
            <img
                src='/Idivine.svg'
                alt='I.DIVINE Logo'
                style={{ height: '40px', marginRight: '20px' }}
            />
            <nav
                style={{
                    fontSize: '30px',
                    display: 'flex',
                    flex: 1,
                    justifyContent: 'center',
                    gap: '30px',
                }}
            >
                <span
                    onClick={() => setActiveComponent('Finder')}
                    style={{
                        cursor: 'pointer',
                        fontWeight:
                            activeComponent === 'Finder' ? 'bold' : 'normal',
                        color:
                            activeComponent === 'Finder' ? '#007bff' : 'white',
                    }}
                >
                    Finder
                </span>
                <span
                    onClick={() => setActiveComponent('Manager')}
                    style={{
                        cursor: 'pointer',
                        fontWeight:
                            activeComponent === 'Manager' ? 'bold' : 'normal',
                        color:
                            activeComponent === 'Manager' ? '#007bff' : 'white',
                    }}
                >
                    Manager
                </span>
            </nav>
        </header>
    );
};

export default Header;
