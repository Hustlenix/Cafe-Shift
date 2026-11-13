import { Link } from 'react-router-dom'
import { ITEMS } from '../data.js'
import { useStore } from '../store.jsx'
import { useEffect, useRef, useState } from 'react'
import { playSound } from '../sounds.js'


const LABEL = { new: 'Order received', preparing: 'Cooking...', done: 'Ready!' }

export default function Cart() {
  const { cart, add, sub, remove, placeOrder, orders } = useStore()
  const [name, setName] = useState('')
  const [placed, setPlaced] = useState(null)
  const [confirming, setConfirming] = useState(false)
  const reviewRef = useRef(null)
  const cancelled = useRef(false)

  // turn { ChocolateCake: 2 } into full item info plus quantity
  const lines = Object.entries(cart)
    .map(([id, qty]) => ({ ...ITEMS.find((i) => i.id === id), qty }))
    .filter((l) => l.name)

  const total = lines.reduce((sum, l) => sum + l.price * l.qty, 0)

  // Returning from the review step drops focus on the floor, so put it back
  // on the button that opened it. The guard keeps this from stealing focus
  // when the page first loads.
  useEffect(() => {
    if (!confirming && cancelled.current) {
      cancelled.current = false
      reviewRef.current?.focus()
    }
  }, [confirming])

  const review = () => {
    setPlaced(null)
    setConfirming(true)
  }

  const cancel = () => {
    cancelled.current = true
    setConfirming(false)
  }

  const place = () => {
    const id = placeOrder(
        name.trim(),
        lines.map((l) => ({name: l.name, qty: l.qty, price: l.price }))
    )
    setPlaced(id)
    setConfirming(false)
    playSound('/sounds/ding.mp3')
    setName('')
  }

  return (
    <div className="cart-page">
      <h1 className="page-title">Your tray</h1>

      {lines.length === 0 ? (
        <p>
          The tray is empty. <Link to="/">Open the menu</Link> and pick something.
        </p>
      ) : confirming ? (
        <section className="confirm" aria-labelledby="confirm-heading">
          <h2 id="confirm-heading">Check your order</h2>
          <ul className="confirm-lines">
            {lines.map((l) => (
              <li key={l.id}>
                <span>{l.qty} &times; {l.name}</span>
                <span className="amt">${(l.price * l.qty).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="confirm-total">Total: ${total.toFixed(2)}</div>
          <p className="confirm-name">For: {name.trim() || 'Guest'}</p>
          <div className="row">
            {/* Focus lands here on purpose: it is the one action that cannot
                be undone, so it should take a deliberate key press. */}
            <button className="btn" onClick={place} autoFocus>Confirm order</button>
            <button className="btn" onClick={cancel}>Keep editing</button>
          </div>
        </section>
      ) : (
        <>
          <ul className="lines">
            {lines.map((l) => (
              <li key={l.id}>
                <img className="icon" src={l.img} alt="" width="48" height="48" />
                <span className="grow">{l.name}</span>
                <button className="mini" onClick={() => sub(l.id)} aria-label={`Remove one ${l.name}`} disabled={l.qty <= 1}>-</button>
                <b>{l.qty}</b>
                <button className="mini" onClick={() => add(l.id)} aria-label={`Add one ${l.name}`}>+</button>
                <span className="amt">${(l.price * l.qty).toFixed(2)}</span>
                <button className="mini" onClick={() => remove(l.id)} aria-label={`Remove ${l.name} from tray`}>x</button>
              </li>
            ))}
          </ul>
          <div className="total">Total: ${total.toFixed(2)}</div>

          <div className="row">
            <input
              aria-label="Your name or table number"
              placeholder="Your name or table no."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button ref={reviewRef} className="btn" onClick={review}>Review order</button>
          </div>
        </>
      )}

      {placed && (
        <p className="ok" role="status">
          Order #{placed} sent to the kitchen!
        </p>
      )}

      {orders.length > 0 && (
        <>
          <h2 className="subhead">Your orders</h2>
          <ul className="status-list">
            {[...orders].reverse().map((o) => (
              <li key={o.id}>
                <b>#{o.id}</b> {o.name}
                <span className={`pill ${o.status}`}>{LABEL[o.status]}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

//used AI
