import React, { useEffect, useRef, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from "react-router-dom";

// Single-file React app for OpenMole (Tailwind assumed available)
// Default export: App

const GAMES = [
  {
    id: "snake",
    title: "Snake",
    desc: "Classic Snake — collect food, grow longer. Use arrow keys or WASD.",
    component: "Snake",
    thumbnail: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='220'><rect rx='12' width='100%' height='100%' fill='%231b5e20'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='28' fill='%23b9f6ca' font-family='Verdana'>Snake</text></svg>",
  },
  {
    id: "pong",
    title: "Pong",
    desc: "A tiny Pong — left paddle (W/S), right paddle (Up/Down).",
    component: "Pong",
    thumbnail: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='220'><rect rx='12' width='100%' height='100%' fill='%232e7d32'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='28' fill='%23c8e6c9' font-family='Verdana'>Pong</text></svg>",
  },
  {
    id: "tictactoe",
    title: "Tic-Tac-Toe",
    desc: "Quick Tic-Tac-Toe against a simple AI. Click a cell to play.",
    component: "TicTacToe",
    thumbnail: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='220'><rect rx='12' width='100%' height='100%' fill='%231f8f29'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='24' fill='%23e8f5e9' font-family='Verdana'>Tic-Tac-Toe</text></svg>",
  },
];

// ----------------- UI Helpers -----------------
function Header() {
  return (
    <header className="bg-gradient-to-r from-green-800 via-green-700 to-green-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center text-green-100 font-bold">OM</div>
          <div>
            <h1 className="text-xl font-bold leading-none">OpenMole</h1>
            <p className="text-xs text-green-100/80">Play browser games · Hosted</p>
          </div>
        </Link>
        <nav className="flex gap-4 items-center">
          <Link to="/" className="text-sm hover:underline">Home</Link>
          <Link to="/about" className="text-sm hover:underline">About</Link>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-8 py-6 text-center text-sm text-green-800/80">
      © {new Date().getFullYear()} OpenMole — Built with ❤️ and green shades.
    </footer>
  );
}

// ----------------- Home -----------------
function Home() {
  return (
    <main className="container mx-auto p-6">
      <section className="mb-6">
        <h2 className="text-3xl font-extrabold text-green-900 mb-2">Discover games on OpenMole</h2>
        <p className="text-green-800/80">A small hosting hub for browser games. Click any card to open the game page and play instantly.</p>
      </section>

      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {GAMES.map((g) => (
            <GameCard key={g.id} game={g} />
          ))}
        </div>
      </section>
    </main>
  );
}

function GameCard({ game }) {
  return (
    <div className="bg-white/80 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img src={game.thumbnail} alt={game.title} className="w-full h-40 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-bold text-green-900">{game.title}</h3>
        <p className="text-green-800/70 text-sm my-2">{game.desc}</p>
        <div className="flex items-center justify-between">
          <Link to={`/game/${game.id}`} className="inline-block px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800">Play Now</Link>
          <span className="text-xs text-green-800/60">Browser</span>
        </div>
      </div>
    </div>
  );
}

// ----------------- Game Pages Router -----------------
function GameRouter() {
  const { id } = useParams();
  const navigate = useNavigate();
  const game = GAMES.find((g) => g.id === id);
  if (!game) return (
    <main className="container mx-auto p-6">
      <p className="text-red-600">Game not found.</p>
      <button onClick={() => navigate('/')} className="mt-3 px-3 py-2 bg-green-600 text-white rounded">Back home</button>
    </main>
  );

  return (
    <main className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-2/3">
          <h2 className="text-2xl font-bold text-green-900 mb-2">{game.title}</h2>
          <p className="text-green-800/80 mb-4">{game.desc}</p>

          <div className="bg-white rounded-lg p-4 shadow">
            {game.component === 'Snake' && <Snake />}
            {game.component === 'Pong' && <Pong />}
            {game.component === 'TicTacToe' && <TicTacToe />}
          </div>
        </div>

        <aside className="md:w-1/3">
          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="font-semibold text-green-900">About this game</h3>
            <p className="text-green-800/80 text-sm mt-2">Simple demo playable right in your browser. Use keyboard controls where applicable.</p>
            <div className="mt-4">
              <Link to="/" className="text-sm text-green-700 hover:underline">Back to library</Link>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

// ----------------- Snake Game -----------------
function Snake() {
  const canvasRef = useRef(null);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const grid = 20;
    const cols = 20;
    const rows = 20;
    canvas.width = cols * grid;
    canvas.height = rows * grid;

    let snake = [{ x: 9, y: 9 }];
    let dir = { x: 0, y: 0 };
    let food = randomFood();
    let speed = 8; // frames per second
    let lastTime = 0;

    function randomFood() {
      return { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
    }

    function draw() {
      ctx.fillStyle = '#0f172a00';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // background
      ctx.fillStyle = '#e8f5e9';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // food
      ctx.fillStyle = '#2e7d32';
      ctx.fillRect(food.x * grid, food.y * grid, grid, grid);

      // snake
      ctx.fillStyle = '#1b5e20';
      snake.forEach((s, i) => {
        ctx.fillRect(s.x * grid + 1, s.y * grid + 1, grid - 2, grid - 2);
      });
    }

    function update() {
      if (dir.x === 0 && dir.y === 0) return;
      const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
      // wrap
      head.x = (head.x + cols) % cols;
      head.y = (head.y + rows) % rows;

      // collision
      if (snake.some((s) => s.x === head.x && s.y === head.y)) {
        snake = [{ x: 9, y: 9 }];
        dir = { x: 0, y: 0 };
        food = randomFood();
        return;
      }

      snake.unshift(head);
      if (head.x === food.x && head.y === food.y) {
        food = randomFood();
      } else {
        snake.pop();
      }
    }

    function loop(time) {
      if (!running) return;
      requestAnimationFrame(loop);
      if (time - lastTime < 1000 / speed) return;
      lastTime = time;
      update();
      draw();
    }

    function key(e) {
      const k = e.key;
      if (['ArrowUp', 'w', 'W'].includes(k)) dir = { x: 0, y: -1 };
      if (['ArrowDown', 's', 'S'].includes(k)) dir = { x: 0, y: 1 };
      if (['ArrowLeft', 'a', 'A'].includes(k)) dir = { x: -1, y: 0 };
      if (['ArrowRight', 'd', 'D'].includes(k)) dir = { x: 1, y: 0 };
    }

    window.addEventListener('keydown', key);
    requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('keydown', key);
      setRunning(false);
    };
  }, [running]);

  return (
    <div>
      <div className="mb-3 text-sm text-green-800/80">Controls: Arrow keys or WASD</div>
      <canvas ref={canvasRef} className="mx-auto block rounded-lg border border-green-200 shadow-sm" />
    </div>
  );
}

// ----------------- Pong -----------------
function Pong() {
  const canvasRef = useRef(null);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = 600;
    const height = 300;
    canvas.width = width;
    canvas.height = height;

    let paddleW = 10, paddleH = 60;
    let leftY = (height - paddleH) / 2;
    let rightY = (height - paddleH) / 2;
    let ball = { x: width / 2, y: height / 2, vx: 3, vy: 2, r: 7 };

    let keys = {};
    function draw() {
      ctx.fillStyle = '#e8f5e9';
      ctx.fillRect(0, 0, width, height);

      // net
      ctx.fillStyle = '#a5d6a7';
      for (let y = 0; y < height; y += 20) ctx.fillRect(width/2 - 1, y, 2, 12);

      // paddles
      ctx.fillStyle = '#1b5e20';
      ctx.fillRect(10, leftY, paddleW, paddleH);
      ctx.fillRect(width - 20, rightY, paddleW, paddleH);

      // ball
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI*2);
      ctx.fillStyle = '#2e7d32';
      ctx.fill();
    }

    function update() {
      // input
      if (keys['w']) leftY -= 6;
      if (keys['s']) leftY += 6;
      if (keys['ArrowUp']) rightY -= 6;
      if (keys['ArrowDown']) rightY += 6;
      leftY = Math.max(0, Math.min(height - paddleH, leftY));
      rightY = Math.max(0, Math.min(height - paddleH, rightY));

      ball.x += ball.vx;
      ball.y += ball.vy;

      // top/bottom
      if (ball.y < ball.r || ball.y > height - ball.r) ball.vy *= -1;

      // paddles collision
      if (ball.x - ball.r < 20 && ball.y > leftY && ball.y < leftY + paddleH) ball.vx *= -1.05;
      if (ball.x + ball.r > width - 20 && ball.y > rightY && ball.y < rightY + paddleH) ball.vx *= -1.05;

      // reset when out
      if (ball.x < 0 || ball.x > width) {
        ball.x = width/2; ball.y = height/2; ball.vx = 3 * (Math.random()>0.5?1:-1); ball.vy = 2;
      }
    }

    function loop() {
      if (!running) return;
      update();
      draw();
      requestAnimationFrame(loop);
    }

    function keydown(e) { keys[e.key] = true; }
    function keyup(e) { keys[e.key] = false; }

    window.addEventListener('keydown', keydown);
    window.addEventListener('keyup', keyup);
    requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('keydown', keydown);
      window.removeEventListener('keyup', keyup);
      setRunning(false);
    };
  }, [running]);

  return (
    <div>
      <div className="mb-3 text-sm text-green-800/80">Controls: Left paddle (W/S) — Right paddle (Up/Down)</div>
      <canvas ref={canvasRef} className="mx-auto block rounded-lg border border-green-200 shadow-sm" />
    </div>
  );
}

// ----------------- TicTacToe -----------------
function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xTurn, setXTurn] = useState(true);
  const winner = calculateWinner(board);

  function handleClick(i) {
    if (board[i] || winner) return;
    const newBoard = board.slice();
    newBoard[i] = xTurn ? 'X' : 'O';
    setBoard(newBoard);
    setXTurn(!xTurn);
  }

  function reset() {
    setBoard(Array(9).fill(null));
    setXTurn(true);
  }

  useEffect(() => {
    // simple AI: if it's O's turn and no winner, pick a random empty cell after short delay
    if (!xTurn && !winner) {
      const empties = board.map((v,i)=>v?null:i).filter(v=>v!==null);
      if (empties.length===0) return;
      const choice = empties[Math.floor(Math.random()*empties.length)];
      const t = setTimeout(() => handleClick(choice), 400);
      return () => clearTimeout(t);
    }
  }, [xTurn, board, winner]);

  return (
    <div>
      <div className="grid grid-cols-3 gap-1 w-64 mx-auto">
        {board.map((cell, i) => (
          <button key={i} onClick={() => handleClick(i)} className="w-20 h-20 bg-white rounded-lg shadow flex items-center justify-center text-2xl font-bold text-green-900">{cell}</button>
        ))}
      </div>

      <div className="mt-4 text-center">
        {winner ? <div className="text-green-900 font-semibold">Winner: {winner}</div> : <div className="text-green-800/80">Turn: {xTurn ? 'Player (X)' : 'AI (O)'}</div>}
        <div className="mt-3"><button onClick={reset} className="px-3 py-2 bg-green-700 text-white rounded">Restart</button></div>
      </div>
    </div>
  );
}

function calculateWinner(b) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (let [a,b1,c] of lines) {
    if (b[a] && b[a] === b[b1] && b[a] === b[c]) return b[a];
  }
  return null;
}

// ----------------- About -----------------
function About() {
  return (
    <main className="container mx-auto p-6">
      <h2 className="text-2xl font-bold text-green-900">About OpenMole</h2>
      <p className="text-green-800/80 mt-3">OpenMole is a small demo game hosting site built to showcase browser games. This starter uses React, client-side routing, and small embedded games. Expand by adding more games to the <code>GAMES</code> array.</p>
    </main>
  );
}

// ----------------- App -----------------
export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white text-green-900 flex flex-col">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/game/:id" element={<GameRouter />} />
          <Route path="*" element={<Home />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}
