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
            else if (data.neighborMines > 0) classes += ` ${styles['count_' + data.neighborMines]}`;
        } else if (data.state === 'FLAGGED') {
            classes += ` ${styles.flagged}`;
        }
        return classes;
    };

    const getAriaLabel = () => {
        if (data.state === 'FLAGGED') return 'Прапорець';
        if (data.state === 'OPENED') {
            if (data.type === 'MINE') return 'Міна';
            return data.neighborMines > 0 ? `Відкрита клітинка з числом ${data.neighborMines}` : 'Відкрита порожня клітинка';
        }
        return 'Закрита клітинка';
    };

    return (
        <button
            type="button"
            className={getClassName()}
            onClick={() => onClick(row, col)}
            onContextMenu={(e) => onContextMenu(e, row, col)}
            aria-label={getAriaLabel()}
        >
            {getCellContent()}
        </button>
    );
};

export default Cell;