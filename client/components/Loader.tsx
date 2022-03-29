import type { NextPage } from 'next';

const Loader: NextPage = () => {
    return (
        <section className="loader-wrap">
            <div className="lds-roller">
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
            </div>
        </section>
    )
}

export default Loader;