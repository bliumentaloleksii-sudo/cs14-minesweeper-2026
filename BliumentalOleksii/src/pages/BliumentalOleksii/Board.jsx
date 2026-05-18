import React from 'react';
import Cell from './Cell';
import styles from './Board.module.css';

const Board = ({ field, onCellClick, onCellContextMenu }) => {
    if (!field || field.length === 0) return null;

    return (
        <div className={styles.board} style={{ gridTemplateColumns: `repeat(${field[0].length}, 30px)`, gridTemplateRows: `repeat(${field.length}, 30px)` }}>
            {field.map((row, rIdx) =>
                row.map((cell, cIdx) => (
                    <Cell key={`${rIdx}-${cIdx}`} row={rIdx} col={cIdx} data={cell} onClick={onCellClick} onContextMenu={onCellContextMenu} />
                ))
            )}
        </div>
    );
};

export default Board;