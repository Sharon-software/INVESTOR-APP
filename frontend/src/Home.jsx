function Home({ onNavigate }) {
    return (
        <div
            style={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'sans-serif',
                gap: 20,
                backgroundImage:
                    'linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.75)), url(/background.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: 'white',
            }}
        >
            <h1>Welcome to InvestorApp</h1>
            <p>Grow your money with smart, simple investments.</p>
            <div style={{ display: 'flex', gap: 15 }}>
                <button
                    onClick={() => onNavigate('register')}
                    style={{ padding: '10px 20px', fontSize: 16, cursor: 'pointer' }}
                >
                    Register
                </button>
                <button
                    onClick={() => onNavigate('login')}
                    style={{ padding: '10px 20px', fontSize: 16, cursor: 'pointer' }}
                >
                    Login
                </button>
            </div>
        </div>
    );
}

export default Home;