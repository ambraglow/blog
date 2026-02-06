---
title: 858D hot air rework station teardown
date: 02/09/2023
description : a small attempt to reverse engineer a cheap hot air gun station bought from aliexpress
---

# schematic of 858D
Here's a part of the schematic i've figured out from looking at the pcb of this 858D hot air station i got off amazon for 40 bucks.
## teardown
Here's the photo from the listing on amazon:  
![image](https://github.com/ambraglow/858D-hot-air-station/assets/42449683/5a13ed8c-10aa-46e1-9b4e-6b7ce3fe6010.png)
It looks pretty much the same irl, here's the inside  
![image](https://github.com/ambraglow/858D-hot-air-station/assets/42449683/7590cbc2-2ec7-4fbb-9891-3517ccb70fae.png) 
It has a transformer that outputs 29 and 10V, to drive the fan and logic circuit.
And this is the main logic board:  
![image](https://github.com/bassusteur/858D-hot-air-station/assets/42449683/75266f30-c80d-4996-93c7-24f3167c1513) 

The inside of the heat gun has this small board connecting everything with different colours and breaking it out to connectors that go on the logic board  
![image](https://github.com/bassusteur/858D-hot-air-station/assets/42449683/fd44483b-4efb-43b7-92e0-d2d2b8010af6)

These 3 connectors are in order: Live and Neutral, transformer primary winding wires and heat gun resistor leads  
![image](https://github.com/bassusteur/858D-hot-air-station/assets/42449683/98a184ce-519f-450e-89a6-fd7119d54bf8)

The main MCU is designed my sino mcu in china, thankfully i found the datasheet [here](https://www.sinomcu.com/upload/serviceSupport/serviceFile/usermanual/MC51F003A4%E7%94%A8%E6%88%B7%E6%89%8B%E5%86%8CV1.4.pdf)  
![image](https://github.com/bassusteur/858D-hot-air-station/assets/42449683/46fdfadd-cc37-45de-87ba-e955419c2233)
