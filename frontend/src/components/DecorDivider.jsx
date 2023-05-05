export default function DecorDivider() {
    return (
        <svg
            style={{
                // border: '2px dotted orange',
                width: '80px',
                height: '80px',
                padding: '20px 0',
            }}
        >
            <rect
                x={14}
                y={6}
                width={10}
                height={10}
                fill="#818181"
                transform="rotate(45, 7.5, 7.5)"
            />

            <rect
                x={24}
                y={-12}
                width={18}
                height={18}
                fill="#8E9B67"
                transform="rotate(45, 7.5, 7.5)"
            />

            <rect
                x={42}
                y={-22}
                width={10}
                height={10}
                fill="#818181"
                transform="rotate(45, 7.5, 7.5)"
            />
        </svg>
    )
}
