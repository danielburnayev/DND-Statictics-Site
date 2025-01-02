class DNDEventStorer extends HTMLDivElement {
    #events; //array containing all the events
    #allHitsChance; //chance all events hit
    #allMissChance; //chance all events miss
    #wantedOutcome; // true if calculating chances to hit, false is calculating chances to miss

    #eventCounter; //the number of DNDEvents on screen
    #maxElementsPerRow;

    #container;
    #allSuccessesText;
    #successfulEventsText;
    #successWithFailEventsText;
    #counterText;
    #buttonPanel;

    #index;
    static #storersCreated = 0;
    static #allStorers = [];
    static #selectedStorer;

    constructor() {
        super();
        
        this.#events = [];
        this.#allHitsChance = NaN;
        this.#allMissChance = NaN;
        this.#wantedOutcome = true;

        this.eventCounter = 0;
        this.#maxElementsPerRow = 8;

        this.index = DNDEventStorer.#allStorers.length;
        DNDEventStorer.#storersCreated++;
        DNDEventStorer.#allStorers[DNDEventStorer.#allStorers.length] = this;
    }

    addDNDEvent(event) {
        this.#checkForDNDEvent(event);
        this.#setAllChancesEdgeCases(1);

        this.#events[this.#events.length] = event;
        this.#allHitsChance *= event.chanceToHit();
        this.#allMissChance *= 1 - event.chanceToHit();

        this.eventCounter++;
    }

    removeDNDEvent(index) {
        var removedEvent = this.#events.splice(index, 1)[0];
        this.#setAllChancesEdgeCases(NaN);

        this.#allHitsChance /= removedEvent.chanceToHit();
        this.#allMissChance /= 1 - removedEvent.chanceToHit();

        this.#adjustEventsIndicies(index);

        this.eventCounter--;
    }

    /*
    returns the probability in which the selected DNDEvents (DNDEvents clicked on by a user) 
    succeed or fail (this depends on what wantedOutcome is)
    */
    chanceSelected() { //make it so that events only has DNDEvents in this class's events field
        if (this.selectedEvents.length == 0) {return NaN;}
        for (const event of this.selectedEvents) {this.#checkForDNDEvent(event);}

        var chance = 1;
        for (const event of this.selectedEvents) {
            chance *= (this.#wantedOutcome) ? event.chanceToHit() : 1 - event.chanceToHit();
        }
        return chance;
    }
    
    /*
    returns the probability in which the selected DNDEvents (DNDEvents clicked on by a user) 
    succeed or fail with respect to the other unselected DNDEvents (this depends on what wantedOutcome is)
    */
    chanceSelectedWithAll() {
        if (this.#events.length == 0) {return NaN;}

        var chance = this.chanceSelected() || 1;
        var opposite = (this.#wantedOutcome) ? this.#allMissChance : this.#allHitsChance;
        
        for (const event of this.selectedEvents) {
            opposite /= (this.#wantedOutcome) ? 1 - event.chanceToHit() : event.chanceToHit();
        }
        return chance * opposite;
    }

    /*
    returns the probability for all DNDEvents succeeding or failing
    */
    chanceAll() {return (this.#wantedOutcome) ? this.#allHitsChance : this.#allMissChance;}

    get wantedOutcome() {return this.#wantedOutcome;}
    set wantedOutcome(newOutcome) {
        if (typeof newOutcome != "boolean") {throw new TypeError("The parameter must be a boolean!")}
        this.#wantedOutcome = newOutcome;
    }

    accountForChangedEvent(chanceBefore, changedEvent) {
        this.#allHitsChance /= chanceBefore;
        this.#allMissChance /= 1 - chanceBefore;

        this.#allHitsChance *= changedEvent.chanceToHit();
        this.#allMissChance *= 1 - changedEvent.chanceToHit();
    }

    clearAllEvents() {
        this.#events = [];
        this.#allHitsChance = NaN;
        this.#allMissChance = NaN;

        this.eventCounter = 0;

        this.#counterText.textContent = "Events: " + this.eventCounter;

        this.#allSuccessesText.textContent = "All succeed: ...%";
        this.#successfulEventsText.textContent = "Selected succeed: ...%";
        this.#successWithFailEventsText.textContent = "Selected succeed and non-selected fail: ...%";

        this.#container.style.height = "200px";
        this.#container.innerHTML = "<div class=\"event-level\"><div class=\"button-panel\"><button class=\"one-event-button\"> Add Event </button></div></div>";

        this.#buttonPanel = document.getElementsByClassName("button-panel")[this.index];
    }

    static removeDNDEventStorer(theStorer) {
        const theIndex = DNDEventStorer.#allStorers.indexOf(theStorer);
        
        theStorer.remove();
        DNDEventStorer.#allStorers.splice(theIndex, 1);

        for (var i = theIndex; i < DNDEventStorer.#allStorers.length; i++) {
            DNDEventStorer.#allStorers[i].index--;
        }

        if (theStorer == DNDEventStorer.selectedStorer) {DNDEventStorer.selectedStorer = undefined;}
    }

    get eventCounter() {return this.#eventCounter;}
    set eventCounter(newCount) {this.#eventCounter = newCount;}

    get maxElementsPerRow() {return this.#maxElementsPerRow;}

    get selectedEvents() {
        const selectedEvents = [];
        for (const event of this.#events) {
            if (event.selected) {selectedEvents[selectedEvents.length] = event;}
        }

        return selectedEvents;
    }

    get index() {return this.#index;}
    set index(newIndex) {this.#index = newIndex;}

    get container() {return this.#container;}
    set container(newContainer) {this.#container = newContainer;}

    get allSuccessesText() {return this.#allSuccessesText;}
    set allSuccessesText(newAllSuccessesText) {this.#allSuccessesText = newAllSuccessesText;}

    get successfulEventsText() {return this.#successfulEventsText;}
    set successfulEventsText(newSuccessfulEventsText) {this.#successfulEventsText = newSuccessfulEventsText;}

    get successWithFailEventsText() {return this.#successWithFailEventsText;}
    set successWithFailEventsText(newSuccessWithFailEventsText) {this.#successWithFailEventsText = newSuccessWithFailEventsText;}

    get counterText() {return this.#counterText;}
    set counterText(newCounterText) {this.#counterText = newCounterText;}

    get buttonPanel() {return this.#buttonPanel;}
    set buttonPanel(newButtonPanel) {this.#buttonPanel = newButtonPanel;}

    static get storersCreated() {return DNDEventStorer.#storersCreated;}

    static get allStorers() {return DNDEventStorer.#allStorers;}

    static get selectedStorer() {return DNDEventStorer.#selectedStorer;}
    static set selectedStorer(newStorer) {DNDEventStorer.#selectedStorer = newStorer;}

    #checkForDNDEvent(event) {
        if (!(event instanceof DNDEvent)) {throw new TypeError("All the parameters must be DNDEvents!");}
    }

    #setAllChancesEdgeCases(num) {
        if (this.#events.length == 0) {
            this.#allHitsChance = num;
            this.#allMissChance = num;
        }
    }

    #adjustEventsIndicies(startingIndex) {
        for (var i = startingIndex; i < this.#events.length; i++) {this.#events[i].index--;} 
    }

}


class DNDEvent extends HTMLDivElement {
    #acToHit; //default value of 15
    #mods; //default value of 0
    #attackType; // 0 is flat, 1 is advantage, 2 is disadvantage. Starts off as 0.
    #storer;
    #index;
    #selected;

    static #eventsCreated = 0;
    
    constructor(storer) {
        super();

        this.ac = 15n;
        this.mods = 0n;
        this.attackType = 0n;
        this.storer = storer;
        this.index = this.storer.eventCounter;
        this.selected = false;
        DNDEvent.#eventsCreated++;
        this.chanceToHit = function() {
            if (this.attackType == 0n) {return Number(this.#numOfChances(this.ac, this.mods)) / 20;}
            else if (this.attackType == 1n) {return Number(this.#numOfChances(this.ac, this.mods) * (40n - this.#numOfChances(this.ac, this.mods))) / 400;}
            else if (this.attackType == 2n) {return Number(this.#numOfChances(this.ac, this.mods) * this.#numOfChances(this.ac, this.mods)) / 400;}
        }
    }

    #numOfChances(acToHit, mods) { //accounts for 1s always missing and 20s always hitting
        if (acToHit < 1n) {return undefined;}
    
        if (acToHit - 20n > mods) {return 1n;}
        else if (mods > acToHit - 2n) {return 19n;}
        return (20n - acToHit + 1n + mods);
    }

    get ac() {return this.#acToHit;}
    set ac(acToHit) {
        this.#checkingNum(acToHit, "AC to hit");
        if (acToHit < 1n) {throw new Error("The AC to hit needs to be greater than or equal to 1!");}
        this.#acToHit = acToHit;
    }
    copySetterAC(acToHit) {this.ac = acToHit;}

    get mods() {return this.#mods;}
    set mods(mods) {
        this.#checkingNum(mods, "modifiers");
        this.#mods = mods;
    }
    copySetterMods(mods) {this.mods = mods;}

    get attackType() {return this.#attackType;}
    set attackType(attackType) {
        this.#checkingNum(attackType, "attack type");
        if (attackType < 0n || attackType > 2n) {throw new Error("Attack types can only range from 0 to 2!");}
        this.#attackType = attackType;
    }
    copySetterAttackType(attackType) {this.attackType = attackType;}

    get index() {return this.#index;}
    set index(newIndex) {this.#index = newIndex;} //do error-checking later

    get selected() {return this.#selected;}
    set selected(newSelection) {this.#selected = newSelection;}

    get storer() {return this.#storer;}
    set storer(newStorer) {this.#storer = newStorer;}

    static get eventsCreated() {return this.#eventsCreated;}

    #checkingNum(num, thing) {
        if (typeof num != "bigint") {throw new TypeError("The " + thing + " needs to be an integer!");}
    }
}