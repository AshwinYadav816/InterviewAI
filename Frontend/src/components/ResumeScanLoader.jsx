import './resume-scan-loader.scss'

/**
 * Full-screen overlay shown while a tailored resume PDF is being generated.
 * A magnifier "scans" a set of documents to convey the AI reading/preparing.
 */
const ResumeScanLoader = () => (
    <div className="resume-scan" role="status" aria-live="polite">
        <div className="resume-scan__card">
            <div className="resume-scan__scene">
                {/* side documents */}
                <div className="doc doc--side doc--left">
                    <span className="doc__corner" />
                    <span className="doc__line" /><span className="doc__line" /><span className="doc__line doc__line--short" />
                </div>
                <div className="doc doc--side doc--right">
                    <span className="doc__corner" />
                    <span className="doc__line" /><span className="doc__line" /><span className="doc__line doc__line--short" />
                </div>

                {/* center document being scanned */}
                <div className="doc doc--center">
                    <span className="doc__corner" />
                    <span className="doc__scan" />
                    <span className="doc__line" /><span className="doc__line" /><span className="doc__line" /><span className="doc__line doc__line--short" />
                </div>

                {/* magnifying glass */}
                <div className="magnifier">
                    <span className="magnifier__lens" />
                    <span className="magnifier__handle" />
                </div>
            </div>

            <p className="resume-scan__title">
                Preparing your resume
                <span className="resume-scan__dots"><span>.</span><span>.</span><span>.</span></span>
            </p>
            <p className="resume-scan__sub">Tailoring and formatting your PDF — this can take up to a minute.</p>
        </div>
    </div>
)

export default ResumeScanLoader
