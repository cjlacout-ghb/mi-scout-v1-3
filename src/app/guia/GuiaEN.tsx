import React from 'react';
import { APP_VERSION } from '@/lib/version';
import { Section, SubTitle, P, Note, Table, ulStyle, olStyle, codeStyle } from './GuiaComponents';

export default function GuiaEN() {
  return (
    <>
      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 8, fontSize: '0.9rem' }}>
        Pitch tracking and strike zone tool for softball.
      </p>
      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 32, fontSize: '0.9rem' }}>
        This guide walks you through everything from installing the app on your phone to generating advanced performance reports. The interface is designed so you can log every play quickly and easily while watching the game.
      </p>

      {/* TABLE OF CONTENTS */}
      <div style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        padding: '16px 20px',
        marginBottom: 40,
      }}>
        <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Contents</p>
        {[
          ['1', 'Installing the App on Your Phone'],
          ['2', 'Activating Your License'],
          ['3', 'Getting Around the App'],
          ['4', 'Line-Up: Starting and Managing Games'],
          ['5', 'Tracking: Logging the Game Live'],
          ['6', 'Heat Map: Stats and Export'],
          ['7', 'Reports'],
          ['8', 'Game History'],
          ['9', 'Color Coding'],
          ['10', 'Auto-Save'],
        ].map(([num, label]) => (
          <a
            key={num}
            href={`#s${num}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '6px 0',
              textDecoration: 'none',
              borderBottom: '1px solid var(--border)',
              color: 'var(--text-primary)',
            }}
          >
            <span style={{ fontSize: '0.72rem', color: 'var(--accent)', fontWeight: 700, minWidth: 18 }}>{num}.</span>
            <span style={{ fontSize: '0.88rem' }}>{label}</span>
          </a>
        ))}
      </div>

      {/* S1 */}
      <Section id="s1" num="1" title="Installing the App on Your Phone">
        <P>MiScout is a Progressive Web App (PWA). There&apos;s no app store involved — you install it straight from your browser, and it works just like any other app on your device.</P>
        <SubTitle>iPhone / iPad (Safari)</SubTitle>
        <ol style={olStyle}>
          <li>Open MiScout in Safari.</li>
          <li>Tap the <strong>Share</strong> button (the square with an arrow pointing up, at the bottom of the screen).</li>
          <li>Scroll down and select <strong>&quot;Add to Home Screen.&quot;</strong></li>
          <li>Tap <strong>Add</strong> in the top-right corner.</li>
          <li>Done! You&apos;ll see the MiScout icon on your home screen.</li>
        </ol>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 4 }}>(*) Steps may vary depending on your OS version.</p>
        <SubTitle>Android (Chrome)</SubTitle>
        <ol style={olStyle}>
          <li>Open MiScout in Google Chrome.</li>
          <li>Tap the <strong>Menu</strong> icon (three vertical dots, top-right corner).</li>
          <li>Select <strong>&quot;Add to Home screen&quot;</strong> or &quot;Install app.&quot;</li>
          <li>Confirm by tapping <strong>Add</strong> or &quot;Install.&quot;</li>
          <li>Done! The app will show up alongside your other apps.</li>
        </ol>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 4 }}>(*) Steps may vary depending on your OS version.</p>
      </Section>

      {/* S2 */}
      <Section id="s2" num="2" title="Activating Your License">
        <P>The first time you open MiScout, the app checks your license before letting you in.</P>
        <ul style={ulStyle}>
          <li>You&apos;ll land on the <strong>Activate License</strong> screen.</li>
          <li>Enter the activation code you were given (format: <code style={codeStyle}>MISCOUT-v13-XXXX-XXXX</code>).</li>
          <li>Once confirmed, the license is <strong>permanently tied to that device</strong> for one year.</li>
          <li>The app validates your license against the server, so you&apos;ll need an internet connection <strong>only for this initial step</strong>.</li>
          <li>After activation, you&apos;re taken straight to the home screen.</li>
        </ul>
        <P>After that first activation, MiScout periodically re-checks your license whenever a connection is available. If your device goes a while without connecting to the internet — say, during a multi-day tournament with no wifi — you can keep using the app normally thanks to a <strong>10-day grace period</strong>. Once that window closes, you&apos;ll need to connect at least once to keep using the app.</P>

        <SubTitle>License Plans</SubTitle>
        <P>MiScout offers two license types:</P>
        <ul style={ulStyle}>
          <li><strong>Professional</strong>: Valid for one year, with access to any updates (releases) published during that period.</li>
          <li><strong>Launch</strong>: A shorter-term license that doesn&apos;t include access to additional updates while it&apos;s active.</li>
        </ul>
        <P>Both are activated the same way, using your activation code.</P>

        <Note>You can pull up this user guide at any time by tapping the <strong>book icon</strong> in the top-right corner of the header.</Note>
      </Section>

      {/* S3 */}
      <Section id="s3" num="3" title="Getting Around the App">
        <SubTitle>Switching Languages (ES/EN)</SubTitle>
        <P>Next to the book icon in the header, you&apos;ll find two buttons: <strong>ES</strong> and <strong>EN</strong>. Tap either one to set your interface language. A few things to keep in mind:</P>
        <ul style={ulStyle}>
          <li>Switching languages changes the interface, labels, and date format (MM/DD/YYYY in English, DD/MM/YYYY in Spanish).</li>
          <li>Data you&apos;ve already entered — team names, player names, pitch types, and so on — doesn&apos;t get translated. It stays exactly as you typed it, regardless of the interface language.</li>
          <li>You can switch languages at any time, even in the middle of a live game.</li>
        </ul>

        <P>The app has <strong>5 main sections</strong>, accessible from the bottom navigation bar:</P>
        <Table
          headers={['Section', 'What it does']}
          rows={[
            ['Line-Up', 'Set up the game and manage rosters'],
            ['Tracking', 'Log pitches in real time'],
            ['Heat Map', 'View stats and heat maps'],
            ['Report', 'Generate and download reports'],
            ['History', 'Browse finished games'],
          ]}
        />
        <P>The active game&apos;s name (e.g., <code style={codeStyle}>AUS vs ARG</code>) always shows at the top of the screen. If you tap the <strong>MiScout</strong> logo in the header while a game is active, you&apos;ll be asked whether you want to return to the home screen — doing so ends the current game session without deleting any data.</P>
      </Section>

      {/* S4 */}
      <Section id="s4" num="4" title="Line-Up: Starting and Managing Games">
        <P><strong>Line-Up</strong> is where everything begins — this is where you set up the game and build your rosters.</P>

        <SubTitle>Starting a New Game</SubTitle>
        <P>Tap <strong>Start</strong> on the home screen to open a form with the following fields:</P>
        <ul style={ulStyle}>
          <li><strong>Away Team</strong> <em>(required)</em>: The visiting team&apos;s name or abbreviation (e.g., <code style={codeStyle}>AUS</code>).</li>
          <li><strong>Home Team</strong> <em>(required)</em>: The home team&apos;s name or abbreviation (e.g., <code style={codeStyle}>ARG</code>).</li>
          <li><strong>Event</strong> <em>(optional)</em>: A short description of the event (e.g., <code style={codeStyle}>Tournament X — Game 1</code>).</li>
          <li><strong>Date</strong>: Defaults to today&apos;s date; tap the field to change it.</li>
          <li><strong>Strike Zone View</strong>: Choose whether you&apos;ll be tracking pitches from the <strong>Catcher&apos;s</strong> or <strong>Pitcher&apos;s</strong> perspective.</li>
        </ul>

        <SubTitle>Managing the Lineup</SubTitle>
        <P>Once the game is created, you&apos;ll see two tabs: <strong>Away</strong> and <strong>Home</strong>. There are two ways to add players:</P>
        <ul style={ulStyle}>
          <li><strong>Add one player</strong>: Opens a form to enter a single player at a time. Saving takes you straight into Tracking.</li>
          <li><strong>Full lineup</strong>: Shows a table where you can enter all 9 (or more) players at once, in batting order. Need more rows? Tap <em>&quot;+ Add row.&quot;</em></li>
        </ul>

        <SubTitle>Player Info</SubTitle>
        <ul style={ulStyle}>
          <li><strong>Jersey #</strong> <em>(required)</em>: Up to 3 digits.</li>
          <li><strong>Last name</strong> <em>(required)</em>.</li>
          <li><strong>First name</strong> <em>(optional)</em>.</li>
          <li><strong>Batting side</strong>: <strong>R</strong> (Right), <strong>L</strong> (Left), or <strong>S</strong> (Switch).</li>
        </ul>

        <SubTitle>Editing the Lineup</SubTitle>
        <P>While the game is in progress:</P>
        <ul style={ulStyle}>
          <li><strong>Edit</strong>: Tap the pencil icon next to a player to correct their info.</li>
          <li><strong>Remove</strong>: Tap the <strong>red ✕</strong> to remove a player from the lineup. <em>To protect your data, this option disappears once the game is finalized.</em></li>
        </ul>

        <SubTitle>Substitutions</SubTitle>
        <P>If a pinch hitter comes in during the game, tap <strong>&quot;Substitute current batter&quot;</strong>:</P>
        <ul style={ulStyle}>
          <li>The outgoing player shows up struck through in the lineup, with a note reading &quot;↳ Replaced by #X LASTNAME (Inning Y).&quot;</li>
          <li>If the original player was a <strong>starter</strong>, a <strong>&quot;Re-enter&quot;</strong> button appears next to their name, letting them return to the game later.</li>
        </ul>

        <SubTitle>Other Actions</SubTitle>
        <ul style={ulStyle}>
          <li>Tapping a player in a <strong>finalized</strong> game takes you straight to their <strong>Heat Map / Stats</strong> screen.</li>
          <li><strong>&quot;New Game&quot;</strong> (the red button) discards the current game and starts over (asks for confirmation).</li>
        </ul>
      </Section>

      {/* S5 */}
      <Section id="s5" num="5" title="Tracking: Logging the Game Live">
        <P><strong>Tracking</strong> is the heart of the app — this is where you log every pitch in real time.</P>

        <SubTitle>Current Batter Header</SubTitle>
        <ul style={ulStyle}>
          <li>The current batter&apos;s <strong>jersey number</strong> (in the gold box).</li>
          <li>Their <strong>last name, first name</strong>, and batting-side initial.</li>
          <li>Their <strong>team</strong>.</li>
          <li>The <strong>current inning</strong>, with ▲ for Top and ▼ for Bottom.</li>
          <li><strong>+</strong> and <strong>−</strong> controls to manually move the inning forward or back.</li>
          <li>Quick game stats: <strong>AB</strong>, <strong>H</strong>, <strong>O</strong>, <strong>K</strong>, <strong>BB/HBP</strong>, and the result of their <strong>last at-bat</strong>.</li>
        </ul>

        <SubTitle>&quot;This Game&quot; vs. &quot;Career&quot; Mode</SubTitle>
        <ul style={ulStyle}>
          <li><strong>This game</strong>: Only pitches logged in the current game.</li>
          <li><strong>Career</strong>: Every pitch ever logged for this player, across all games. <em>(Only available once the game is finalized.)</em></li>
        </ul>

        <SubTitle>Logging a Pitch</SubTitle>
        <ol style={olStyle}>
          <li><strong>Tap the zone</strong> where the pitch crossed. The zone is split into 8 sectors — zones <strong>1 through 4</strong> are the inner zones, and zones <strong>5 through 8</strong> are the corners/perimeter. The exact coordinates of your tap are recorded.</li>
          <li><strong>Choose the pitch type</strong> (a panel slides up from the bottom): Drop, Riser, Curve, Changeup, Screw, or Other.</li>
          <li><strong>Choose the at-bat result:</strong></li>
        </ol>

        <Table
          headers={['Result', 'Additional steps']}
          rows={[
            ['OUT', 'Out type (Assisted / Fly / Sac bunt / Line out) → Fielder (1–9, 7/8, 8/9) → Contact quality (Soft / Hard)'],
            ['KS', 'Strikeout swinging — ends the at-bat immediately'],
            ['KL', 'Strikeout looking — ends the at-bat immediately'],
            ['HIT', 'Hit type (Single / Double / Triple / Home Run / Infield Hit / Bunt Hit) → Field location → Contact quality (Soft / Hard)'],
            ['BB', 'Walk — ends the at-bat immediately'],
            ['HBP', 'Hit by pitch — ends the at-bat immediately'],
          ]}
        />
        <Note>You can back up in the panel by tapping the <strong>← arrow</strong> in the top-left corner, or cancel by tapping <strong>✕</strong> to exit without saving.</Note>

        <SubTitle>Confirming or Correcting a Pitch</SubTitle>
        <ul style={ulStyle}>
          <li><strong>Confirm</strong>: Saves the at-bat and moves to the next batter.</li>
          <li><strong>Edit</strong>: If you tapped the wrong spot, tap a new point in the zone before confirming to fix it.</li>
        </ul>

        <SubTitle>Switching Half-Innings</SubTitle>
        <P>Once the defense records 3 outs, tap the <strong>⇄</strong> button (to the right of the batting-order carousel) to switch which team is up. You&apos;ll get a confirmation prompt showing the half-inning about to start. You can also adjust the inning manually using the <strong>+</strong> and <strong>−</strong> buttons.</P>

        <SubTitle>Picking a Different Batter</SubTitle>
        <P>The &quot;Batting Order&quot; carousel below the strike zone shows the jersey numbers of all active players. You can tap any player there — including one out of the regular batting order — if you want to track them directly.</P>

        <SubTitle>Batter&apos;s At-Bat History</SubTitle>
        <P>Below the strike zone, you&apos;ll see every at-bat logged for the current player in this game, most recent first. From here you can:</P>
        <ul style={ulStyle}>
          <li><strong>✎ Edit</strong> an at-bat: Change the zone by tapping a new point, and/or update the pitch details from the panel.</li>
          <li><strong>✕ Delete</strong> an at-bat (with confirmation).</li>
        </ul>

        <SubTitle>Player Notes</SubTitle>
        <P>At the bottom of the screen there&apos;s a free-text field for jotting down notes about the current player (e.g., &quot;Struggles with low pitches&quot;). Notes save automatically once you stop typing.</P>

        <SubTitle>Finishing the Game</SubTitle>
        <P>Tap <strong>&quot;Finish Game&quot;</strong> (the red button). Once finalized:</P>
        <ul style={ulStyle}>
          <li>The game is archived in <strong>History</strong>.</li>
          <li>The strike zone switches to <strong>read-only mode</strong> (locked to the catcher&apos;s perspective).</li>
          <li><strong>Career mode</strong>, <strong>Reports</strong>, and full <strong>History</strong> access become available.</li>
        </ul>
      </Section>

      {/* S6 */}
      <Section id="s6" num="6" title="Heat Map: Stats and Export">
        <P>The <strong>Heat Map</strong> section lets you dig into any player&apos;s performance.</P>

        <SubTitle>Player Selector</SubTitle>
        <P>At the top, you&apos;ll find a dropdown menu with every player from both teams in the selected game. You can sort the list two ways:</P>
        <ul style={ulStyle}>
          <li><strong>Batting order</strong>: Lists players in the order they appear in the selected game&apos;s lineup.</li>
          <li><strong>AVG</strong>: Sorts players by batting average, color-coded by value.</li>
        </ul>

        <SubTitle>&quot;This Game&quot; vs. &quot;Career&quot; Mode</SubTitle>
        <P><em>Only available once the game is finalized.</em></P>
        <ul style={ulStyle}>
          <li><strong>This game</strong>: Shows data from the current game only.</li>
          <li><strong>Career</strong>: Combines data from <strong>every game</strong> recorded for the selected player.</li>
        </ul>

        <SubTitle>Player Metrics</SubTitle>
        <Table
          headers={['Stat', 'Description']}
          rows={[
            ['AB', 'Total at-bats'],
            ['H', 'Hits'],
            ['A/F', 'Outs (Assisted + Fly)'],
            ['KS/KL', 'Strikeouts (swinging + looking)'],
            ['BB/HBP', 'Walks and hit-by-pitches'],
            ['AVG', 'Batting average'],
          ]}
        />

        <SubTitle>The Heat Map</SubTitle>
        <P>The strike zone is always shown <strong>from the catcher&apos;s perspective</strong> (regardless of which view was used during tracking), with each sector color-coded by how dangerous the batter is in that zone:</P>
        <ul style={ulStyle}>
          <li><span style={{ color: '#62BB46', fontWeight: 700 }}>Green / Blue</span>: Cold zone — the batter rarely gets hits there.</li>
          <li><span style={{ color: '#FFC20E', fontWeight: 700 }}>Yellow</span>: Neutral zone.</li>
          <li><span style={{ color: '#F58220', fontWeight: 700 }}>Orange</span> / <span style={{ color: '#F15B40', fontWeight: 700 }}>Red</span>: Hot zone — this batter is dangerous here.</li>
        </ul>
        <P>A <strong>COLD → HOT</strong> legend below the zone helps you read the color scale.</P>

        <SubTitle>Zone Breakdown</SubTitle>
        <P>A table shows, for each of the 8 zones: Pitches, AB, Hits, A/F, K, and AVG (color-coded). The inner zones (1–4) are visually separated from the perimeter zones (5–8).</P>

        <SubTitle>Pitch Type Breakdown</SubTitle>
        <P>Another table shows how the batter performs against each pitch type (Drop, Riser, Curve, Changeup, Screw, Other): how many they saw, how many led to a completed at-bat, how many strikeouts, and the batting average against that pitch. Only pitch types actually thrown appear in the table.</P>

        <SubTitle>Live Heat Map (On-the-Fly)</SubTitle>
        <P>You don&apos;t need to wait for the game to end to check the heat map. Head to the <strong>Heat Map</strong> section any time during the game to see the selected batter&apos;s stats updated in real time, based on whatever&apos;s been logged so far.</P>
        <Note><strong>Career mode</strong> only becomes available once the game is finalized. While a game is in progress, the heat map only reflects data from <strong>this game</strong>.</Note>

        <SubTitle>Exporting the Heat Map as an Image (PNG)</SubTitle>
        <P>You can save the selected batter&apos;s heat map as a PNG image directly to your device.</P>
        <ul style={ulStyle}>
          <li>Tap the <strong>&quot;Export PNG&quot;</strong> button below the heat map.</li>
          <li>The image captures the strike zone with its current coloring, including the per-zone stat tooltips.</li>
          <li>The file downloads automatically, named after the player (e.g., <code style={codeStyle}>heatmap_smith.png</code>).</li>
          <li>Great for sharing the analysis with coaches or players without them needing access to the app.</li>
        </ul>
      </Section>

      {/* S7 */}
      <Section id="s7" num="7" title="Reports">
        <Note>Reports are only available once the game is <strong>finalized</strong>.</Note>
        <P>You can generate four kinds of reports, combining two dimensions:</P>
        <Table
          headers={['', 'This Game', 'Career']}
          rows={[
            ['Individual player', '✓', '✓'],
            ['Full team', '✓', '✓'],
          ]}
        />
        <ul style={ulStyle}>
          <li><strong>Player / This game</strong>: Analysis of the selected player in this game only.</li>
          <li><strong>Player / Career</strong>: Combines every game on record for that player.</li>
          <li><strong>Team / This game</strong>: A summary of every player on the team for this game.</li>
          <li><strong>Team / Career</strong>: A career summary of every player on the team.</li>
        </ul>
        <P>Before downloading, you&apos;ll see a <strong>preview</strong> of the report right on screen. Tap <strong>&quot;Download .md&quot;</strong> to save the report to your device as a Markdown file. The file name is generated automatically (e.g., <code style={codeStyle}>scout_smith_m.md</code> or <code style={codeStyle}>scout_team_career.md</code>).</P>
      </Section>

      {/* S8 */}
      <Section id="s8" num="8" title="Game History">
        <P>The <strong>History</strong> section keeps every game you&apos;ve finalized. Each card shows: the date, both teams, the event description, and the number of innings played.</P>
        <ul style={ulStyle}>
          <li><strong>Tap a card</strong> to load the game and view its stats in <strong>Heat Map</strong>.</li>
          <li><strong>Tap &quot;Select Player&quot;</strong> (the small gold button on the card) to load the game&apos;s <strong>Line-Up</strong>, from where you can jump into any player&apos;s stats.</li>
          <li><strong>✕ Delete</strong> a game (asks for confirmation, since this <em>permanently erases all data</em> and can&apos;t be undone).</li>
        </ul>

        <SubTitle>Resuming a Game (▶ Continue)</SubTitle>
        <P>If a game was left unfinished, its card in History shows a <strong>▶ Continue</strong> button. Tapping it reopens that game exactly where you left off, ready to keep tracking.</P>
        <Note>Only one game can be active at a time. If you resume a game while another one is in progress, the active game is automatically finalized before the one you selected reopens.</Note>
      </Section>

      {/* S9 */}
      <Section id="s9" num="9" title="Color Coding">
        <P>MiScout uses a consistent color scheme throughout, so you can read the data at a glance:</P>
        <Table
          headers={['Color', 'Meaning']}
          rows={[
            ['Red', 'HIT (offensive success)'],
            ['Green', 'OUT / KS / KL (defensive success)'],
            ['Blue', 'BB / HBP (walk or hit-by-pitch)'],
          ]}
        />
        <P>On the <strong>heat map</strong>, the scale runs from <span style={{ color: '#62BB46', fontWeight: 700 }}>cool green</span> to <span style={{ color: '#F15B40', fontWeight: 700 }}>hot red</span>, passing through yellow and orange.</P>
        <P>In <strong>AVG tables</strong>, the number&apos;s color runs from green (low average) to red (high average).</P>
      </Section>

      {/* S10 */}
      <Section id="s10" num="10" title="Auto-Save">
        <P>MiScout saves your progress automatically on your device — <strong>no internet connection needed during the game</strong>. If the app closes unexpectedly or your phone runs out of battery, reopening it picks up the game exactly where you left off.</P>
      </Section>

      {/* Footer */}
      <div style={{
        marginTop: 48,
        paddingTop: 24,
        borderTop: '1px solid var(--border)',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
          © 2026 <span style={{ color: '#FFFFFF', fontWeight: 700 }}>Mi</span><span style={{ color: '#F5A623', fontWeight: 700 }}>Scout</span> — All rights reserved.<br />
          MiScout is proprietary software. Copying, redistribution, modification, or commercial use<br />
          without the author&apos;s written permission is strictly prohibited.<br /><br />
          <em>Disclaimer: MiScout is a statistical tracking and analysis tool. Its use does not guarantee athletic results, wins, or specific performance improvements.</em><br /><br />
          Meta info: Version {APP_VERSION} | Language: English | Last updated: August 2026
        </p>
      </div>
    </>
  );
}
