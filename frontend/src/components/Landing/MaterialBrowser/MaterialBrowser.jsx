export default function MaterialBrowser() {
    return (
        <section>
            <div>
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
            </div>

            <div>
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
            </div>
        </section>
    )
}
