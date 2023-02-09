import { NavLink } from 'react-router-dom'

export default function Help() {
    return (
        <section>
            <h1>We're Here To Help</h1>
            <p>
                Check out this list of resources to help answer questions you
                may have, or find more on our help page.
            </p>

            {/* Help Links */}
            <div>
                <NavLink to="#">
                    <img src="" alt="" />
                </NavLink>

                <NavLink to="#">
                    <img src="" alt="" />
                </NavLink>

                <NavLink to="#">
                    <img src="" alt="" />
                </NavLink>

                <NavLink to="#">
                    <img src="" alt="" />
                </NavLink>
            </div>

            <NavLink to="#">Looking For Something Else?</NavLink>
        </section>
    )
}
