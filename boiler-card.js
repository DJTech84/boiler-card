class BoilerCard extends HTMLElement {

  setConfig(config) {
    if (!config.background) {
      throw new Error("Devi specificare background:");
    }
    this._config = config;
  }

  set hass(hass) {

    if (!this.content) {

      this.innerHTML = `
        <ha-card>
          <div class="wrapper">

            <img class="bg"/>

            <!-- SINISTRA -->
            <div class="field working" id="working"></div>
            <div class="field mode" id="mode"></div>
            <div class="field temp" id="temp"></div>
            <div class="field boost" id="boost"></div>
            <div class="field showers" id="showers"></div>
            <!-- PULSANTI MODALITÀ (sempre visibili) -->
            <div class="modeButtons">
              <button class="modeBtn green"   id="btnGREEN">GREEN</button>
              <button class="modeBtn imemory" id="btnIMEMORY">IMEMORY</button>
            
              <button class="modeBtn program" id="btnPROGRAM">PROGRAM</button>
              <button class="modeBtn boost"   id="btnBOOST">BOOST</button>
            </div>


            <!-- DESTRA BOX 1 -->
            <div class="row powerrow">
              <span class="label">STATUS</span>
              <span class="value" id="power"></span>
            </div>

            <div class="row nightrow">
              <span class="label">NIGHT MODE</span>
              <span class="value" id="night"></span>
            </div>

            <div class="row currentrow">
              <span class="label">CURRENT TEMP.</span>
              <span class="value" id="current"></span>
            </div>
            
            <div class="row anticoolstatusrow">
              <span class="label">ANTICOOLING</span>
              <span class="value" id="anticoolstatus"></span>
            </div>

            

            <!-- DESTRA BOX 2 -->
            <div class="row settemprow">
              <span class="label">SET TEMP.</span>
              <span class="value" id="settemp"></span>
            </div>

            <div class="row maxtemprow">
              <span class="label">MAX SET TEMP.</span>
              <span class="value" id="maxtemp"></span>
            </div>

            <div class="row anticoolrow">
              <span class="label">ANTICOOLING TEMP.</span>
              <span class="value" id="anticool"></span>
            </div>

            <!-- DESTRA BOX 3 -->
            <div class="row errorrow">
              <span class="label">ERROR</span>
              <span class="value" id="error"></span>
            </div>

            <div class="row resistorrow">
              <span class="label">RESISTOR</span>
              <span class="value" id="resistor"></span>
            </div>

            <div class="row pumprow">
              <span class="label">PUMP</span>
              <span class="value" id="pump"></span>
            </div>
            <!-- DISPLAY IN BASSO SUL BOILER -->
            <div class="field boilerdisplay" id="boilerdisplay"></div>

          </div>
        </ha-card>
      `;

      /* CSS */
      const style = document.createElement("link");
      style.rel = "stylesheet";
      style.href = "/local/community/boiler-card/boiler-card.css";
      this.appendChild(style);

      this.content = this.querySelector(".wrapper");
    }
    
    
    



    const cfg = this._config;

    /* BACKGROUND */
    this.querySelector(".bg").src = cfg.background;

    /* SENSORI */
    const mode = hass.states[cfg.mode]?.state || "-";
    
    /* WORKING LABEL*/
    this.querySelector("#working").textContent = "WORKING MODE";


    /* ============================= */
    /* PULSANTI MODALITÀ FISSI       */
    /* ============================= */
    
    const setMode = (newMode) => {
      hass.callService("water_heater", "set_operation_mode", {
        entity_id: cfg.mode,
        operation_mode: newMode
      });
    };
    
    /* GREEN */
    this.querySelector("#btnGREEN").onclick = () => setMode("GREEN");
    
    /* IMEMORY */
    this.querySelector("#btnIMEMORY").onclick = () => setMode("IMEMORY");
    
    /* PROGRAM */
    this.querySelector("#btnPROGRAM").onclick = () => setMode("PROGRAM");
    
    /* BOOST */
    this.querySelector("#btnBOOST").onclick = () => setMode("BOOST");



    const showers = hass.states[cfg.showers]?.state || "0";
    

    /* SINISTRA */
    this.querySelector("#mode").textContent = mode;
 
    




    const tempNow = parseFloat(hass.states[cfg.current_temp]?.state || 0);
    this.querySelector("#temp").textContent = tempNow.toFixed(0) + " °C";

    this.querySelector("#boilerdisplay").textContent =
        tempNow.toFixed(0) + "°";

    /* ANTICOOLING SWITCH STATUS */
    this.querySelector("#anticoolstatus").textContent =
      (hass.states[cfg.anticool_switch]?.state || "-").toUpperCase();
    
    /* CLICK SU ANTICOOLING */
    const anticoolValue = this.querySelector("#anticoolstatus");
    
    anticoolValue.style.cursor = "pointer";
    
    anticoolValue.onclick = () => {
      hass.callService("switch", "toggle", {
        entity_id: cfg.anticool_switch
      });
    };




    this.querySelector("#boost").textContent =
      (hass.states[cfg.boost]?.state || "-").toUpperCase();
    /* ============================= */
    /* CLICK SU BOOST                */
    /* ============================= */
    
    const boostValue = this.querySelector("#boost");
    
    boostValue.style.cursor = "pointer";
    
    boostValue.onclick = () => {
      hass.callService("switch", "toggle", {
        entity_id: cfg.boost
      });
    };




    this.querySelector("#showers").textContent = showers;




    /* DESTRA */
    this.querySelector("#power").textContent =
      (hass.states[cfg.power]?.state || "-").toUpperCase();
      /* ============================= */
    /* CLICK SU STATUS (ON/OFF)      */
    /* ============================= */
    
    const powerValue = this.querySelector("#power");
    
    /* rende visivamente cliccabile */
    powerValue.style.cursor = "pointer";
    
    /* click → toggle entità */
    powerValue.onclick = () => {
      hass.callService("switch", "toggle", {
        entity_id: cfg.power
      });
    };





    this.querySelector("#night").textContent =
      (hass.states[cfg.night]?.state || "-").toUpperCase();
    /* ============================= */
    /* CLICK SU NIGHT MODE           */
    /* ============================= */
    
    const nightValue = this.querySelector("#night");
    
    nightValue.style.cursor = "pointer";
    
    nightValue.onclick = () => {
      hass.callService("switch", "toggle", {
        entity_id: cfg.night
      });
    };







    this.querySelector("#current").textContent =
      tempNow.toFixed(0) + " °C";
     

    const setTemp = parseFloat(hass.states[cfg.set_temp]?.state || 0);
    this.querySelector("#settemp").textContent =
      setTemp.toFixed(0) + " °C";

    const maxTemp = parseFloat(hass.states[cfg.max_temp]?.state || 0);
    this.querySelector("#maxtemp").textContent =
      maxTemp.toFixed(0) + " °C";

    const antiCool = parseFloat(hass.states[cfg.anticool]?.state || 0);
    this.querySelector("#anticool").textContent =
      antiCool.toFixed(0) + " °C";

    this.querySelector("#error").textContent =
      hass.states[cfg.error]?.state || "0";

    this.querySelector("#resistor").textContent =
      parseFloat(hass.states[cfg.resistor]?.state || 0).toFixed(1) + " kWh";

    this.querySelector("#pump").textContent =
      parseFloat(hass.states[cfg.pump]?.state || 0).toFixed(1) + " kWh";

    /* COLORI MODE */
    const modeColors = {
      GREEN: "lime",
      IMEMORY: "deepskyblue",
      PROGRAM: "orange",
      BOOST: "red"
    };

    this.querySelector("#mode").style.color =
      modeColors[mode] || "white";
  }

  getCardSize() {
    return 3;
  }
}

customElements.define("boiler-card", BoilerCard);
