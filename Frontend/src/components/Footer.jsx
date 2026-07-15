import './footer.scss'

const Footer = () => {
    const year = new Date().getFullYear()

    return (
        <footer className="app-footer">
            <span className="app-footer__glow" />

            <div className="app-footer__main">
                <div className="app-footer__brand-block">
                    <span className="app-footer__brand">
                        <span className="app-footer__spark">✦</span>
                        <span className="app-footer__brand-text">InterviewAI</span>
                    </span>
                    <p className="app-footer__tagline">
                        Turn any job description into a winning interview strategy.
                    </p>
                </div>

                <div className="app-footer__badge">
                    <span className="app-footer__badge-dot" />
                    Powered by Google Gemini
                </div>
            </div>

            <div className="app-footer__bottom">
                <span>© {year} InterviewAI</span>
                <span className="app-footer__made">
                    Crafted with <span className="app-footer__heart">✦</span> for job seekers
                </span>
            </div>
        </footer>
    )
}

export default Footer
