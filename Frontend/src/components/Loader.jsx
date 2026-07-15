import './loader.scss'

/**
 * A branded full-screen loading state.
 * @param {string} message  - main line (e.g. "Loading your interview plan")
 * @param {string} subtitle - optional smaller line below
 */
const Loader = ({ message = "Loading", subtitle }) => {
    return (
        <main className="app-loader">
            <div className="app-loader__spinner">
                <div className="app-loader__ring" />
                <div className="app-loader__core">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                    </svg>
                </div>
            </div>

            <p className="app-loader__text">
                {message}
                <span className="app-loader__dots"><span>.</span><span>.</span><span>.</span></span>
            </p>

            {subtitle && <p className="app-loader__sub">{subtitle}</p>}
        </main>
    )
}

export default Loader
