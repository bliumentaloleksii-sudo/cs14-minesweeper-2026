import React from 'react';
import styles from './Cell.module.css';

const Cell = ({ row, col, data, onClick, onContextMenu }) => {
    const getCellContent = () => {
        if (data.state === 'FLAGGED') return '🚩';
        if (data.state === 'OPENED') {
            if (data.type === 'MINE') return '💣';
            return data.neighborMines > 0 ? data.neighborMines : '';
        }
        return '';
    };

    const getClassName = () => {
        let classes = styles.cell;
        if (data.state === 'OPENED') {
            classes += ` ${styles.opened}`;
            if (data.type === 'MINE') classes += ` ${styles.exploded}`;
            else if (data.neighborMines > 0) {
                classes += ` ${styles['count_' + data.neighborMines]}`;
            }
        } else if (data.state === 'FLAGGED') {
            classes += ` ${styles.flagged}`;
        }
        return classes;
    };

    return (
        <button
            type="button"
            className={getClassName()}
            onClick={() => onClick(row, col)}
            onContextMenu={(e) => onContextMenu(e, row, col)}
            aria-label={`Рядок ${row + 1}, стовпець ${col + 1}, стан ${data.state.toLowerCase()}`}
        >
            {getCellContent()}
        </button>
    );
};

export default Cell;