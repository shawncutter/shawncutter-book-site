---
title: "Mud and Motherboards"
arc: forging
status: draft
date_written: "2026-01-04"
themes: [resilience, accident, farm, systems-thinking, technology, family]
---

# Mud and Motherboards

The day we dragged an oilfield into the cloud—and why the digital world needs to remember the dirt beneath it.

Texas, 2010. Noon heat. Tank battery baking under a white sky. Hot crude and dust in the air. I’ve got a laptop on one arm and a rusty wrench in my back pocket. That contrast was my life: code in one hand, iron in the other.

We were Fielding Systems back then. Small team. Big claim. Put the oilfield online. Real-time well data, web dashboards, fewer clipboards, fewer “I’ll check it tomorrow” calls. Obvious now; heresy then. “We’ve always done it this way,” the old hands said. Fair. The field punishes pretty ideas.

A mid-sized operator finally gave us a pilot. Three remote wells. No Wi-Fi. Barely any cell signal. No Ethernet for a hundred miles. So we built a hopscotch network out of parts and stubbornness: high-gain radio on the tallest tank → shot to a grain silo ten miles north → relay to a tiny ISP tower outside town → the internet. Zip-ties and hope.

We mounted the mast. Tightened the U-bolts. Aligned the dish by dead-reckoning and a printed topo map. I climbed down the ladder, leg barking from an old injury, and slid into the truck’s sliver of shade. Laptop open. Our dashboard came up: rows of sensor IDs, waiting to turn green.

Nothing.

The hotspot hunted for a bar like a thirsty dog. Five minutes. Ten. Sweat running into my eyes. Alan drumming on the hood. A tech yelled from the tank top: “Wind spun the antenna—she’s off.” He was right. The dish had drifted a few degrees. The grain silo was no longer in the beam.

Back up the ladder. Steel hot under my palms. I muscled the dish back to the mark and cranked the clamp. “We got something!” Alan shouted.

A single green dot. Then another. Then a cascade—pressure and flow from three jack pumps drawing heartbeat lines across the grid. I whooped. Alan mimed chewing his hard hat. We’d dragged mud into the cloud and it stuck.

Victory lasted four minutes.

One pump jack started screaming—clank, clank, then a tearing squeal. On the screen, pressure fell like a cliff. Alarm popped red. Our system worked. It told the truth in real time. Now we had to respect it.

We killed the unit before it puked a spill. Wrenches out. Elbows in grease. The seal had blown. Ten minutes later we were oily, tired, and back online. Lesson delivered the old-fashioned way: the cloud can see a failure; it cannot replace a seal. Not yet.

Driving out, the adrenaline burned off and the point set in. Abstraction is power. Abstraction without the dirt is fragility. The physical world sets the terms. Ignore it and it will educate you with a bill.

What changed after that day wasn’t our pitch. It was our posture. We designed like the field was the boss.

• Ground truth first. If the reading conflicts with what your boots see, the boots win until you reconcile it.

• Assume breakage. Store-and-forward at the edge. Heartbeats and loss-of-signal alarms. No silent failures.

• Alarms to playbooks, not inboxes. A red flag must route to a specific person with a first move and a time.

• Offline-tolerant everything. Data can’t be held hostage by a cell tower having a bad day.

• Human factors matter. Big fonts in the sun. One-handed workflows with gloves. Photos beat paragraphs.

• Design for the dirty fix. Part numbers, torque specs, QR codes to manuals. The right wrench wins the hour.

• Telemetry is not triumph. Value shows up when a human can act faster, safer, cheaper—today.

That pilot worked because we stood in both worlds at once. Laptop and ladder. Antenna alignment by signal strength and by squinting at a grain silo on the horizon. We didn’t romanticize the iron, and we didn’t worship the cloud. We made them shake hands.

Years later, that handshake is still my operating picture. Energy parks. Greenhouses. Data centers. Same law: progress must carry weight in the real world. If a system can’t survive heat, dust, noise, and a tired human at 2 a.m., it isn’t a system. It’s a slide.

Cutter Rule: Knowing = predictive power under pressure. If the model can’t predict the next hour in a place that smells like hot crude and dust, it isn’t knowledge; it’s decoration.

Field Test: Walk a site with your dashboard in hand. Pick three alarms. For each, write the first move, the tool you need, and the time to safe state. If you can’t do that in two minutes per alarm, your software is a report, not a response.

Why tell the story now? Because “cloud” won the word war. It lost some respect for gravity. We didn’t build Fielding by convincing the field to think like software. We built it by making software behave in the field. Mud first. Motherboards next. In that order.

**The practical takeaway was this:** technology can amplify and inform, but it can’t replace understanding the ground truth. Abstraction is powerful, but abstraction without appreciation for the concrete world leads to fragile systems. We bridged mud and motherboards that day, and every system I build now — from energy farms to agtech — straddles that divide on purpose. I make sure my head is in the cloud when it should be, but my boots are always planted firmly on the ground. Because progress doesn’t mean much if it can’t handle a little mud.

