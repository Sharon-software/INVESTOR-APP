import './Home.css';

function Home({ onNavigate, onInvestToday }) {
    return (
        <main className="home-page">
            <section className="home-hero" aria-labelledby="home-title">
                <span className="home-eyebrow">YOUR NEXT CHAPTER STARTS HERE</span>
                <h1 id="home-title">Make your money<br />move with purpose.</h1>
                <p className="home-description">
                    Build toward your goals with straightforward investment options
                    designed to help you get started.
                </p>
                <button className="home-primary-button" onClick={onInvestToday}>
                    Invest Today <span aria-hidden="true">→</span>
                </button>
                <div className="home-account-links">
                    <p className="home-login-prompt">
                        Already have an account?{' '}
                        <button className="home-text-button" onClick={() => onNavigate('login')}>
                            Log in
                        </button>
                    </p>
                    <p className="home-login-prompt">
                        New to InvestorApp?{' '}
                        <button className="home-text-button" onClick={() => onNavigate('register')}>
                            Create an account
                        </button>
                    </p>
                </div>
            </section>
        </main>
    );
}

export default Home;