function Landing() {
    return (
        <section>
            <header>
                <h1>C&H</h1>
                <h1>Landscape Materials</h1>
                <address>
                    5725 W 7th St. Texarkana, TX 75501 | 903-334-7350
                </address>
            </header>

            {/* NAVBAR */}
            <nav>
                <ul>
                    <li>Home</li>
                    <li>About</li>
                    <li>Materials</li>
                    <li>Carports</li>
                    <li>Calculator</li>
                    <li>Help</li>
                    <li>Contact</li>
                </ul>
            </nav>

            {/* BULLETIN BOARD */}
            <section>
                <h1>Bulletin Board</h1>
                <article>
                    <h2>Thanksgiving Hours</h2>
                    <h3>Posted: 11/17/2022 6:17am</h3>
                    <p>
                        This is a bulletin post that is supposed to relay some
                        kind of information. It should mostly be used for
                        company-wide or site-wide alerts, pertaining to
                        impactions regarding services rendered; holiday hours;
                        updates; product availability issues; etc.
                    </p>
                </article>
                <article>
                    <h2>Closed Saturdays Until Spring</h2>
                    <h3>Posted: 10/27/2022 12:09pm</h3>
                    <p>
                        Newer bulletin posts should appear at the top of the
                        list. This is also a bulletin post, it is just slightly
                        older. This post also should have relevant information
                        to company logistics, impactions, and other
                        considerations used to relay important, vital
                        information to the general public.
                    </p>
                </article>
            </section>

            {/* BROWSE MATERIALS */}
            <section>
                <h1>Browse Our Materials</h1>
                <div>{/* Image Carousel */}</div>
                <nav>
                    <ul>
                        <li>Gravel</li>
                        <li>Soil</li>
                        <li>Compost</li>
                        <li>Mulch</li>
                        <li>Flagstone</li>
                        <li>Creek Rock</li>
                    </ul>
                </nav>
                <h2>Soil</h2>
                <article>
                    <div className="flex">
                        <img src="" alt="" />
                        <div>
                            <h3>Unscreened Topsoil</h3>
                            <p>
                                We carry a local, unscreened (unfiltered) sandy
                                loam topsoil, great for use in planting,
                                gardening, filling holes, and much more. Its
                                general-purpose qualities make it a mainstay in
                                a large variety of landscaping projects.
                            </p>
                        </div>
                    </div>
                </article>

                <article>
                    <div className="flex">
                        <img src="" alt="" />
                        <div>
                            <h3>Premium Organic Compost</h3>
                            <p>
                                Our premium organic compost is rich in nutrients
                                made mostly from hardwood sawdust and chicken
                                litter. It is excellent for blending into your
                                own soil or our topsoil, for use in planting and
                                gardening. You can also add it to your lawn for
                                enrichment.
                            </p>
                        </div>
                    </div>
                </article>

                <article>
                    <div className="flex">
                        <img src="" alt="" />
                        <div>
                            <h3>70/30 Mix (Special Blend)</h3>
                            <p>
                                70/30 is our in-house blend of 70% Premium
                                Compost with 30% Masonry Sand, where the compost
                                provides a great source of nutrients and the
                                sand helps with drainage, together creating an
                                excellent garden soil blend.
                            </p>
                            <small>
                                Tip: Blend in with topsoil or your own soil if
                                it is draining too quickly.
                            </small>
                        </div>
                    </div>
                </article>

                <a href="/materials">View All Materials</a>
            </section>

            {/* HOW MUCH DO I NEED */}
            <section>
                <h1>How much do I need?</h1>
                <div>
                    <a href="/calculator">Try our Calculator</a>
                    <img src="" alt="" />
                </div>
                <p>For bulk materials only (soils, mulches, and gravel)</p>
                <small>Disclaimer: Calculations are an approimation only</small>
            </section>

            {/* DELIVERY SECTION */}
            <section>
                <h1>Want It Delivered?</h1>
                <p>
                    We offer delivery services on our bulk products, whichc an
                    be transported and dumped in and around the Texarkana area.
                </p>
                <div>
                    <a href="/delivery">Learn More</a>
                    <a href="/materials">View Materials</a>
                </div>
                {/* dump trailer */}
                <img src="" alt="" />
            </section>

            {/* EAGLE CARPORTS */}
            <section></section>
        </section>
    )
}

export default Landing
