export default function ShapeDisplay({ shape, dimensions }) {
    const contentColor = '#91DAA7'

    // const figureTrapezoidHeightTextPlacement = (height) => {
    //     console.log('[figureTrapezoidHeightTextPlacement] height: ' + height)
    //     if (height === 0) {
    //         return '48%'
    //     }

    //     if (height > 0 && height <= 9) {
    //         return '40%'
    //     }

    //     if (height >= 10 && height <= 99) {
    //         return '40%'
    //     }

    //     if (height >= 100 && height <= 999) {
    //         return '35%'
    //     }
    // }

    switch (shape) {
        case 'rectangle':
            return (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        alignItems: 'center',
                    }}
                >
                    <svg width={200} height={260}>
                        {/* Length Text */}
                        <text
                            x={-50}
                            y={-85}
                            fill="black"
                            fontSize="18"
                            transform="rotate(90, 0, 100) scale(-1, -1)"
                        >
                            {dimensions && dimensions.length > 0 ? (
                                <>
                                    {dimensions.length}{' '}
                                    {dimensions.lengthUnit === 'feet'
                                        ? 'ft'
                                        : 'in'}
                                </>
                            ) : (
                                <>Length</>
                            )}
                        </text>

                        {/* Width Text */}
                        <text x={70} y={16} fill="black" fontSize="18">
                            {dimensions && dimensions.width > 0 ? (
                                <>
                                    {dimensions.width}{' '}
                                    {dimensions.widthUnit === 'feet'
                                        ? 'ft'
                                        : 'in'}
                                </>
                            ) : (
                                <>Width</>
                            )}
                        </text>

                        {/* Rectangle */}
                        <rect
                            width={160}
                            height={220}
                            x={20}
                            y={20}
                            style={{
                                fill: contentColor,
                                fillOpacity: 1,
                            }}
                        />
                    </svg>
                    <div style={{ fontSize: '1.2rem' }}>
                        <strong>Rectangle</strong>
                    </div>
                </div>
            )

        case 'rectangleBorder':
            return (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        alignItems: 'center',
                    }}
                >
                    <svg
                        width={220}
                        height={290}
                        style={{
                            marginRight: '0.4em',
                        }}
                    >
                        <rect
                            width={220}
                            height={260}
                            transform="translate(0, 30)"
                            style={{ fill: contentColor }}
                        />
                        <rect
                            width={140}
                            height={180}
                            x={40}
                            y={40}
                            transform="translate(0, 30)"
                            style={{
                                fill: '#FFF',
                                fillOpacity: 1,
                            }}
                        />
                        {/* Inner Width Text */}
                        <text
                            x={
                                dimensions && dimensions.innerWidth > 0
                                    ? '40%'
                                    : '30%'
                            }
                            y={86}
                            fill="black"
                            fontSize="17"
                        >
                            {dimensions && dimensions.innerWidth > 0 ? (
                                <>
                                    {dimensions.innerWidth}{' '}
                                    {dimensions.innerWidthUnit === 'feet'
                                        ? 'ft'
                                        : 'in'}
                                </>
                            ) : (
                                <>Inner Width</>
                            )}
                        </text>

                        {/* Inner Length Text */}
                        <text
                            x={
                                dimensions && dimensions.innerLength > 0
                                    ? -85
                                    : -120
                            }
                            y={-45}
                            fill="black"
                            fontSize="17"
                            transform="rotate(90, 0, 100) scale(-1, -1)"
                        >
                            {dimensions && dimensions.innerLength > 0 ? (
                                <>
                                    {dimensions.innerLength}{' '}
                                    {dimensions.innerLengthUnit === 'feet'
                                        ? 'ft'
                                        : 'in'}
                                </>
                            ) : (
                                <>Inner Length</>
                            )}
                        </text>

                        {/* Border Width Dashes */}
                        <text
                            x={33}
                            y={0}
                            fill="black"
                            fontSize="17"
                            fontWeight="bold"
                            transform="rotate(90, 0, 100) scale(-1, -1)"
                        >
                            ---->
                        </text>

                        {/* Border Width Text */}
                        <text
                            x={30}
                            y={18}
                            fill="black"
                            fontSize="17"
                            fontWeight="bold"
                        >
                            Border Width
                        </text>

                        {/* Border Width Measurement */}
                        <text
                            x={108}
                            y={55}
                            fontWeight="bold"
                            fontSize={14}
                            // transform="rotate(90, -90, 80) scale(-1, -1)"
                        >
                            {dimensions && dimensions.borderWidth > 0 ? (
                                <>
                                    {dimensions.borderWidth}{' '}
                                    {dimensions.borderWidthUnit === 'feet'
                                        ? 'ft'
                                        : 'in'}
                                </>
                            ) : (
                                <></>
                            )}
                        </text>
                    </svg>
                    <div style={{ fontSize: '1.2rem' }}>
                        <strong>Rectangle Border</strong>
                    </div>
                </div>
            )

        case 'circle':
            return (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        alignItems: 'center',
                    }}
                >
                    <svg
                        width={200}
                        height={200}
                        style={{ marginRight: '0.4em' }}
                    >
                        <ellipse
                            cx={100}
                            cy={100}
                            rx={100}
                            ry={100}
                            style={{
                                fill: contentColor,
                                fillOpacity: 1,
                            }}
                        />

                        <text
                            x={
                                dimensions && dimensions.diameter
                                    ? '38%'
                                    : '26%'
                            }
                            y="45%"
                            fontWeight="bold"
                            fontSize="18"
                        >
                            {dimensions && dimensions.diameter > 0 ? (
                                <>
                                    {dimensions.diameter}{' '}
                                    {dimensions.diameterUnit === 'feet'
                                        ? 'ft'
                                        : 'in'}
                                </>
                            ) : (
                                <>Diameter</>
                            )}
                        </text>

                        <text x={0} y="55%" fontWeight="bold" fontSize="18">
                            ----------------------------
                        </text>
                    </svg>
                    <div style={{ fontSize: '1.2rem' }}>
                        <strong>Circle</strong>
                    </div>
                </div>
            )

        case 'circleBorder':
            return (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        alignItems: 'center',
                    }}
                >
                    <div style={{ fontSize: '1rem' }}>
                        <strong>Border Width</strong>
                    </div>
                    <svg
                        width={200}
                        height={200}
                        style={{ marginRight: '0.4em' }}
                    >
                        <ellipse
                            cx={100}
                            cy={100}
                            rx={100}
                            ry={100}
                            style={{
                                fill: contentColor,
                                fillOpacity: 1,
                            }}
                        />

                        <ellipse
                            cx={100}
                            cy={100}
                            rx={50}
                            ry={50}
                            style={{
                                fill: '#F3F3F3',
                                fillOpacity: 1,
                            }}
                        />

                        {/* Inner Diameter Text */}
                        <text
                            x={
                                dimensions && dimensions.innerDiameter > 0
                                    ? '43%'
                                    : '26%'
                            }
                            y="49%"
                            fontSize={
                                dimensions && dimensions.innerDiameter > 0
                                    ? '18'
                                    : '11'
                            }
                            fontWeight="bold"
                        >
                            {dimensions && dimensions.innerDiameter > 0 ? (
                                <>
                                    {dimensions.innerDiameter}{' '}
                                    {dimensions.innerDiameterUnit === 'feet'
                                        ? 'ft'
                                        : 'in'}
                                </>
                            ) : (
                                <>Inner Diameter</>
                            )}
                        </text>

                        <text x="26%" y="56%" fontSize="18" fontWeight="bold">
                            -----------
                        </text>

                        {/* Border Width Text */}
                        <text x="54%" y="17%" fontSize="14" fontWeight="bold">
                            {dimensions && dimensions.borderWidth > 0 ? (
                                <>
                                    {dimensions.borderWidth}{' '}
                                    {dimensions.borderWidthUnit === 'feet'
                                        ? 'ft'
                                        : 'in'}
                                </>
                            ) : (
                                <></>
                            )}
                        </text>

                        <text
                            x={52}
                            y={5}
                            fill="black"
                            fontSize="17"
                            fontWeight="bold"
                            transform="rotate(90, 0, 100) scale(-1, -1)"
                        >
                            ---->
                        </text>
                    </svg>
                    <div style={{ fontSize: '1.2rem' }}>
                        <strong>Circle Border</strong>
                    </div>
                </div>
            )

        case 'annulus':
            return (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        alignItems: 'center',
                    }}
                >
                    <div style={{ fontWeight: 'bold' }}>
                        ---{' '}
                        {dimensions && dimensions.outerDiameter > 0 ? (
                            <>
                                {dimensions.outerDiameter}{' '}
                                {dimensions.outerDiameterUnit === 'feet'
                                    ? 'ft'
                                    : 'in'}
                            </>
                        ) : (
                            <>Outer Diameter</>
                        )}{' '}
                        ---
                    </div>
                    <svg
                        width={200}
                        height={200}
                        style={{ marginRight: '0.4em' }}
                    >
                        <line x1={1} y1={-10} x2={1} y2={50} stroke="black" />
                        <line
                            x1={198}
                            y1={-10}
                            x2={198}
                            y2={50}
                            stroke="black"
                        />
                        <ellipse
                            cx={100}
                            cy={100}
                            rx={100}
                            ry={100}
                            style={{
                                fill: contentColor,
                                fillOpacity: 1,
                            }}
                        />

                        <ellipse
                            cx={100}
                            cy={100}
                            rx={50}
                            ry={50}
                            style={{
                                fill: '#F3F3F3',
                                fillOpacity: 1,
                            }}
                        />

                        {/* Inner Diameter Text */}
                        <text
                            x={
                                dimensions && dimensions.innerDiameter > 0
                                    ? '40%'
                                    : '26%'
                            }
                            y="47%"
                            fontWeight="bold"
                            fontSize={
                                dimensions && dimensions.innerDiameter > 0
                                    ? 13
                                    : 11
                            }
                        >
                            {dimensions && dimensions.innerDiameter > 0 ? (
                                <>
                                    {dimensions.innerDiameter}{' '}
                                    {dimensions.innerDiameterUnit === 'feet'
                                        ? 'ft'
                                        : 'in'}
                                </>
                            ) : (
                                <>Inner Diameter</>
                            )}
                        </text>
                        <text x="25%" y="53%" fontWeight="bold" fontSize="16">
                            -------------
                        </text>
                    </svg>
                    <div style={{ fontSize: '1.2rem' }}>
                        <strong>Annulus</strong>
                    </div>
                </div>
            )

        case 'triangle':
            return (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        alignItems: 'center',
                    }}
                >
                    <svg
                        width={200}
                        height={200}
                        style={{ marginRight: '0.4em' }}
                    >
                        <text
                            x={-95}
                            y={85}
                            fontWeight="bold"
                            fontSize={20}
                            transform="rotate(120, 0, 0) scale(-1, -1)"
                            fill="black"
                        >
                            {dimensions && dimensions.sideA > 0 ? (
                                <>
                                    {dimensions.sideA}{' '}
                                    {dimensions.sideAUnit === 'feet'
                                        ? 'ft'
                                        : 'in'}
                                </>
                            ) : (
                                <>Side A</>
                            )}
                        </text>

                        <text
                            x={120}
                            y={-95}
                            fontWeight="bold"
                            fontSize={20}
                            transform="rotate(62, 0, 0)"
                            fill="black"
                        >
                            {dimensions && dimensions.sideB > 0 ? (
                                <>
                                    {dimensions.sideB}{' '}
                                    {dimensions.sideBUnit === 'feet'
                                        ? 'ft'
                                        : 'in'}
                                </>
                            ) : (
                                <>Side B</>
                            )}
                        </text>
                        <polygon
                            points="100,0 200,190 0,190"
                            style={{
                                fill: contentColor,
                                strokeWidth: 1,
                            }}
                        />
                        <polygon
                            points="100,0 200,190 0,190"
                            style={{
                                fill: contentColor,
                                strokeWidth: 1,
                            }}
                        />
                    </svg>
                    <div
                        style={{
                            fontWeight: 'bold',
                            fontSize: '20px',
                            position: 'relative',
                            top: '-20px',
                        }}
                    >
                        {dimensions && dimensions.sideC > 0 ? (
                            <>
                                {dimensions.sideC}{' '}
                                {dimensions.sideCUnit === 'feet' ? 'ft' : 'in'}
                            </>
                        ) : (
                            <>Side C</>
                        )}
                    </div>
                    <div style={{ fontSize: '1.2rem' }}>
                        <strong>Triangle</strong>
                    </div>
                </div>
            )

        case 'trapezoid':
            return (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        alignItems: 'center',
                    }}
                >
                    <svg
                        width={200}
                        height={200}
                        style={{ marginRight: '0.4em' }}
                    >
                        <polygon
                            points="0,200 40,40 160,40 200,200"
                            style={{
                                fill: contentColor,
                                strokeWidth: 1,
                            }}
                        />
                        <text
                            x="35%"
                            y={35}
                            fontSize="16px"
                            fill="black"
                            fontWeight="bold"
                        >
                            {dimensions && dimensions.sideA > 0 ? (
                                <>
                                    {dimensions.sideA}{' '}
                                    {dimensions.sideAUnit === 'feet'
                                        ? 'ft'
                                        : 'in'}
                                </>
                            ) : (
                                <>Side A</>
                            )}
                        </text>

                        <text
                            x={40}
                            y={60}
                            transform="rotate(90, 100, 100)"
                            fontWeight="bold"
                            fontSize="16px"
                        >
                            ---------------------
                        </text>

                        <text
                            x={
                                dimensions &&
                                (dimensions.height === 0
                                    ? '38%'
                                    : dimensions.height >= 0 &&
                                      dimensions.height <= 9
                                    ? '48%'
                                    : dimensions.height >= 10 &&
                                      dimensions.height <= 99
                                    ? '45%'
                                    : dimensions.height >= 100 &&
                                      dimensions.height <= 999
                                    ? '40%'
                                    : '35%')
                            }
                            y="63%"
                            fontWeight="bold"
                        >
                            {dimensions && dimensions.height > 0 ? (
                                <>
                                    {dimensions.height}{' '}
                                    {dimensions.heightUnit === 'feet'
                                        ? 'ft'
                                        : 'in'}
                                </>
                            ) : (
                                <>Height</>
                            )}
                        </text>
                    </svg>
                    <div
                        style={{
                            fontWeight: 'bold',
                            fontSize: '16px',
                            position: 'relative',
                            top: '-8px',
                        }}
                    >
                        {dimensions && dimensions.sideB > 0 ? (
                            <>
                                {dimensions.sideB}{' '}
                                {dimensions.sideBUnit === 'feet' ? 'ft' : 'in'}
                            </>
                        ) : (
                            <>Side B</>
                        )}
                    </div>
                    <div style={{ fontSize: '1.2rem' }}>
                        <strong>Trapezoid</strong>
                    </div>
                </div>
            )

        default:
            return <></>
    }
}
