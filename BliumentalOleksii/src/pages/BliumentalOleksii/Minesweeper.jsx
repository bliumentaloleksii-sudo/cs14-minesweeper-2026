import React, { useState, useEffect, useRef } from 'react';
import Board from './Board';
import styles from './Minesweeper.module.css';

const ROWS = 10;
const COLS = 10;
const MINES_COUNT = 15;

const Minesweeper = () => {
    const [field, setField] = useState([]);
    const [status, setStatus] = useState('PLAYING'); // 'PLAYING', 'WON', 'LOST'
    const [timer, setTimer] = useState(0);
    const [flagsCount, setFlagsCount] = useState(0);
    const [message, setMessage] = useState('');
    
    const isFirstClick = useRef(true);
    const timerId = useRef(null);

    const initGame = () => {
        if (timerId.current) clearInterval(timerId.current);
        timerId.current = null;
        isFirstClick.current = true;
        setTimer(0);
        setStatus('PLAYING');
        setFlagsCount(0);
        setMessage('');

        // Початкова генерація порожнього поля
        const initialField = Array.from({ length: ROWS }, () =>
            Array.from({ length: COLS }, () => ({
                type: 'EMPTY', state: 'CLOSED', neighborMines: 0
            }))
        );
        setField(initialField);
    };

    useEffect(() => {
        initGame();
        return () => { if (timerId.current) clearInterval(timerId.current); };
    }, []);

    const startTimer = () => {
        if (timerId.current) return;
        timerId.current = setInterval(() => {
            setTimer(prev => (prev < 999 ? prev + 1 : prev));
        }, 1000);
    };

    const placeMinesSafely = (currentField, firstR, firstC) => {
        let placed = 0;
        while (placed < MINES_COUNT) {
            const r = Math.floor(Math.random() * ROWS);
            const c = Math.floor(Math.random() * COLS);
            if ((r !== firstR || c !== firstC) && currentField[r][c].type !== 'MINE') {
                currentField[r][c].type = 'MINE';
                placed++;
            }
        }

        // Розрахунок сусідів
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                if (currentField[r][c].type === 'MINE') continue;
                let count = 0;
                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        const nr = r + dr, nc = c + dc;
                        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
                            if (currentField[nr][nc].type === 'MINE') count++;
                        }
                    }
                }
                currentField[r][c].neighborMines = count;
            }
        }
    };

    const openCellRecursive = (currentField, r, c) => {
        if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return;
        const cell = currentField[r][c];
        if (cell.state !== 'CLOSED' || cell.type === 'MINE') return;

        cell.state = 'OPENED';
        if (cell.neighborMines === 0) {
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    openCellRecursive(currentField, r + dr, c + dc);
                }
            }
        }
    };

    const handleCellClick = (r, c) => {
        if (status !== 'PLAYING' || field[r][c].state !== 'CLOSED') return;

        const newField = JSON.parse(JSON.stringify(field)); // Глибоке копіювання стану

        if (isFirstClick.current) {
            placeMinesSafely(newField, r, c);
            isFirstClick.current = false;
            startTimer();
        }

        if (newField[r][c].type === 'MINE') {
            newField[r][c].state = 'OPENED';
            setStatus('LOST');
            clearInterval(timerId.current);
            setMessage('Ви натрапили на міну! Гра закінчена.');
            // Відкриваємо всі міни
            for (let row = 0; row < ROWS; row++) {
                for (let col = 0; col < COLS; col++) {
                    if (newField[row][col].type === 'MINE') newField[row][col].state = 'OPENED';
                }
            }
        } else {
            openCellRecursive(newField, r, c);
            
            // Перевірка перемоги
            let hasWon = true;
            for (let row = 0; row < ROWS; row++) {
                for (let col = 0; col < COLS; col++) {
                    if (newField[row][col].type !== 'MINE' && newField[row][col].state !== 'OPENED') {
                        hasWon = false;
                    }
                }
            }
            if (hasWon) {
                setStatus('WON');
                clearInterval(timerId.current);
                setMessage('Вітаємо! Ви перемогли!');
            }
        }
        setField(newField);
    };

    const handleCellContextMenu = (e, r, c) => {
        e.preventDefault();
        if (status !== 'PLAYING' || field[r][c].state === 'OPENED') return;

        const newField = [...field];
        const cell = newField[r][c];

        if (cell.state === 'CLOSED') {
            cell.state = 'FLAGGED';
            setFlagsCount(prev => prev + 1);
        } else if (cell.state === 'FLAGGED') {
            cell.state = 'CLOSED';
            setFlagsCount(prev => prev - 1);
        }
        setField(newField);
    };

    const getResetButtonEmoji = () => {
        if (status === 'WON') return '😎';
        if (status === 'LOST') return '😵';
        return '🙂';
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <header className={styles.gameHeader}>
                    <div className={styles.counter}>
                        {String(MINES_COUNT - flagsCount).padStart(3, '0')}
                    </div>
                    <button className={styles.resetBtn} onClick={initGame}>
                        {getResetButtonEmoji()}
                    </button>
                    <div className={styles.counter}>
                        {String(timer).padStart(3, '0')}
                    </div>
                </header>
                <Board 
                    field={field} 
                    onCellClick={handleCellClick} 
                    onCellContextMenu={handleCellContextMenu} 
                />
            </div>
            {message && <div className={styles.statusMessage}>{message}</div>}
        </div>
    );
};

export default Minesweeper;