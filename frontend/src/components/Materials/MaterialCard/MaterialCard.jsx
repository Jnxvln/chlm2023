import styles from './MaterialCard.module.scss'
import { Panel } from 'primereact/panel'
import { ScrollPanel } from 'primereact/scrollpanel'
import { Ripple } from 'primereact/ripple'

export default function MaterialCard({ material }) {
    const template = (options) => {
        const toggleIcon = options.collapsed
            ? 'pi pi-chevron-down'
            : 'pi pi-chevron-up'
        const className = `${options.className} justify-content-start`

        return (
            <div className={styles.descriptionTemplateContainer}>
                <button
                    className={options.togglerClassName}
                    onClick={options.onTogglerClick}
                >
                    <span className={`${toggleIcon} pl-2 pr-2`}></span>
                    <Ripple />
                </button>
                <span className={styles.descriptionTemplateTitle}>
                    Description
                </span>
            </div>
        )
    }

    const formatStock = (stock) => {
        switch (stock) {
            case 'new':
                return 'New Shipment!'
            case 'in':
                return 'In Stock'
            case 'low':
                return 'Low Stock'
            case 'out':
                return 'Out of Stock!'
            case 'notavail':
                return 'Not Available'
            default:
                return 'Error'
        }
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>{material.name}</header>
            <div className={styles.imageContainer}>
                <img
                    src={material.image}
                    alt={material.name}
                    className={styles.image}
                />
            </div>
            <div
                className={`${
                    styles.stock
                } stock-${material.stock.toLowerCase()}`}
            >
                {formatStock(material.stock)}
            </div>

            <div className={styles.detailsContainer}>
                {material.binNumber && (
                    <div>
                        <strong>Bin #:</strong> {material.binNumber}
                    </div>
                )}

                {material.size && (
                    <div>
                        <strong>Size: </strong> {material.size}
                    </div>
                )}
            </div>
            <Panel
                headerTemplate={template}
                toggleable
                collapsed={true}
                className={styles.descriptionContainer}
            >
                <ScrollPanel
                    style={{ height: '100px' }}
                    className={styles.scrollPanel}
                >
                    {material.description && material.description.length && (
                        <span>{material.description}</span>
                    )}
                </ScrollPanel>
            </Panel>
        </div>
    )
}
