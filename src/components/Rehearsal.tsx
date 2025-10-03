import './Rehearsal.css';

const Rehearsal = () => (
    <section id="rehearsal">
        <div className="container">
            <h2>Choir Rehearsal Schedule</h2>
            <table className="rehearsal-schedule" aria-label="Choir rehearsal schedule">
                <thead>
                    <tr>
                        <th>Day</th>
                        <th>Time</th>
                        <th>Location</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Tuesday</td>
                        <td>5:00 PM — 7:00 PM</td>
                        <td>Yemata Shopping Complex, Alagbaka</td>
                    </tr>
                    <tr>
                        <td>Thursday</td>
                        <td>5:00 PM — 7:00 PM</td>
                        <td>Yemata Shopping Complex, Alagbaka</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>
);

export default Rehearsal;