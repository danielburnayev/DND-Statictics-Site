/* 
   =====================================================================================================
   ===================================================================================================== 
                                            Runner Code Below 
   =====================================================================================================
   =====================================================================================================
*/

customElements.define('dnd-event', DNDEvent, {extends: 'div'});
customElements.define('dnd-event-storer', DNDEventStorer, {extends: 'div'});

const ogStorer = document.getElementsByClassName("event-storer")[0];
const addStorerButton = document.getElementById("one-storer-button");
const selectorBox = document.createElement("div");

assignStorerEventListeners(ogStorer, 
    document.getElementsByClassName("one-event-button")[0], 
    document.getElementsByClassName("remove-storer-button")[0], 
    document.getElementsByClassName("clear-dndevents-button")[0], 
    document.getElementsByClassName("one-event-button")[1]
    );

defineStorersElems(ogStorer, 
    document.getElementsByClassName("event-container")[0], 
    document.getElementsByClassName("all-events-success-text")[0], 
    document.getElementsByClassName("selected-success-text")[0], 
    document.getElementsByClassName("selected-success-and-fail-text")[0], 
    document.getElementsByClassName("event-counter-text")[0], 
    document.getElementsByClassName("button-panel")[0]);

selectStorer(ogStorer);


//initializeSelectorBox();

//defineSelectorBoxListeners(document.getElementsByClassName("event-container")[0]);

// selectorBox.addEventListener("drag", function (theEvent) {
//     const ogX = Number(selectorBox.style.left.substring(0, selectorBox.style.left.length - 2));
//     const ogY = Number(selectorBox.style.top.substring(0, selectorBox.style.top.length - 2));
//     selectorBox.style.width = Math.abs(theEvent.pageX - ogX) + "px";
//     selectorBox.style.height = Math.abs(theEvent.pageY - ogY) + "px";
// });
// selectorBox.addEventListener("dragend", function () {
//     resetSelectorBox();
//     selectorBox.remove();
// });

window.addEventListener("keydown", function (theEvent) {
    if (DNDEventStorer.selectedStorer != undefined && 
        (theEvent.key == "Backspace" || theEvent.key == "Delete") &&
        document.activeElement.classList.item(0) != "num-input") {
        // Along with removing the item, it shortens the length of the array it's in by one, 
        // so I have to remove every element from the 0th index in order to remove all the array's items
        const ogLength = DNDEventStorer.selectedStorer.selectedEvents.length;
        for (var i = 0; i < ogLength; i++) {
            removeDNDEventFromScreen(DNDEventStorer.selectedStorer.selectedEvents[0], DNDEventStorer.selectedStorer);
        }
    }
});

/* 
   =====================================================================================================
   ===================================================================================================== 
                                            Runner Code Above 
   =====================================================================================================
   =====================================================================================================
*/



function defineStorersElems(theStorer, container, allChanceText, selectedChanceText, 
                            selctedWithAllChanceText, eventCounterText, buttonPanel) {
    theStorer.container = container;
    theStorer.allSuccessesText = allChanceText;
    theStorer.successfulEventsText = selectedChanceText;
    theStorer.successWithFailEventsText = selctedWithAllChanceText;
    theStorer.counterText = eventCounterText;
    theStorer.buttonPanel = buttonPanel;
}

function assignStorerEventListeners(theStorer, addMultipleEventsButton, removeStorerButton, 
                                    clearAllButton, addEventButton) {
    addMultipleEventsButton.addEventListener("click", function () {
        addDNDEventToScreen(theStorer);
    });
    removeStorerButton.addEventListener("click", function () {
        DNDEventStorer.removeDNDEventStorer(theStorer);
        if (DNDEventStorer.selectedStorer == undefined) {
            selectStorer(DNDEventStorer.allStorers[theStorer.index - ((theStorer.index > 0) ? 1 : 0)]);
        }

        if (DNDEventStorer.allStorers.length == 1) {
            document.getElementsByClassName("remove-storer-button")[0].disabled = true;
        }
    });
    clearAllButton.addEventListener("click", function () {
        theStorer.clearAllEvents();
        document.getElementsByClassName("one-event-button")[theStorer.index * 2 + 1].addEventListener("click", function () {
            addDNDEventToScreen(theStorer);
        });
    });
    addEventButton.addEventListener("click", function () {
        addDNDEventToScreen(theStorer);
    });
    theStorer.addEventListener("click", function (theEvent) {
        if (!(theEvent.target.classList.contains("event-storer") || 
            theEvent.target.classList.contains("seperator-line") ||
            theEvent.target.classList.contains("top-stuff") ||
            theEvent.target.classList.contains("event-counter-text") || 
            theEvent.target.classList.contains("chance-stuff") ||
            theEvent.target.classList.contains("all-events-success-text") || 
            theEvent.target.classList.contains("selected-success-text") || 
            theEvent.target.classList.contains("selected-success-and-fail-text") ||
            theEvent.target.classList.contains("event-container") ||
            theEvent.target.classList.contains("button-panel") ||
            theEvent.target.classList.contains("event-level"))) {
                return false;
        }
        
        selectStorer(theStorer);
    });
}

// function initializeSelectorBox() {
//     selectorBox.draggable = true;
//     selectorBox.id = "selector-box";
//     selectorBox.style.position = "absolute";
// }

// function resetSelectorBox() {
//     selectorBox.style.width = "0px";
//     selectorBox.style.height = "0px";
// }

// function defineSelectorBoxListeners(container) {
//     container.addEventListener("mousedown", function (theEvent) {
//         selectStorer(theStorer);
//         if (theEvent.target.classList.item(0) != "event-container") {return false;}
        
//         selectorBox.style.left = theEvent.pageX + "px";
//         selectorBox.style.top = theEvent.pageY + "px";
//         container.appendChild(selectorBox);
//     });
//     container.addEventListener("mouseup", function () {
//         resetSelectorBox();
//         selectorBox.remove();
//     });
// }

function selectStorer(theStorer) {
    if (DNDEventStorer.selectedStorer == undefined) {
        DNDEventStorer.selectedStorer = theStorer;
        DNDEventStorer.selectedStorer.style.backgroundColor = "rgb(230, 166, 83)";
        console.log("1");
    }
    else if (theStorer == DNDEventStorer.selectedStorer) {
        DNDEventStorer.selectedStorer.style.backgroundColor = "";
        DNDEventStorer.selectedStorer = undefined;
       console.log("2");
    }
    else {
        DNDEventStorer.selectedStorer.style.backgroundColor = "";
        DNDEventStorer.selectedStorer = theStorer;
        DNDEventStorer.selectedStorer.style.backgroundColor = "rgb(230, 166, 83)";
        console.log("3");
    }

    const rect = theStorer.getBoundingClientRect();
    window.scrollTo({
        left: rect.left + window.scrollX, 
        top: rect.top + window.scrollY - 55,
        behavior: "smooth",
    });
}

function addDNDEventStorerToScreen() {
    const newStorer = new DNDEventStorer();
    const seperatingLine1 = document.createElement("div");
    const seperatingLine2 = document.createElement("div");
    const topStuff = document.createElement("div");
    const eventCounterText = document.createElement("p");
    const addMultipleEventsButton = document.createElement("button");
    const storerName = document.createElement("h1");
    const clearAllButton = document.createElement("button");
    const removeStorerButton = document.createElement("button");
    const container = document.createElement("div");
    const eventLevel = document.createElement("div");
    const buttonPanel = document.createElement("div");
    const addEventButton = document.createElement("button");
    const chanceStuff = document.createElement("div");
    const allChanceText = document.createElement("h2");
    const selectedChanceText = document.createElement("h2");
    const selctedWithAllChanceText = document.createElement("h2");

    newStorer.classList.add("event-storer");

    seperatingLine1.classList.add("seperator-line");
    topStuff.classList.add("top-stuff");
    container.classList.add("event-container");
    container.style.height = "200px";
    chanceStuff.classList.add("chance-stuff");
    seperatingLine2.classList.add("seperator-line");
    
    addMultipleEventsButton.classList.add("one-event-button");
    addMultipleEventsButton.textContent = "Add Event";

    eventCounterText.classList.add("event-counter-text");
    eventCounterText.textContent = "Events: 0";
    storerName.classList.add("storer-name");
    storerName.setAttribute("contenteditable", "true");
    storerName.textContent = "Round " + DNDEventStorer.storersCreated;

    clearAllButton.classList.add("clear-dndevents-button");
    clearAllButton.textContent = "Clear All";
    removeStorerButton.classList.add("remove-storer-button");
    removeStorerButton.textContent = "X";

    eventLevel.classList.add("event-level");
    buttonPanel.classList.add("button-panel");
    addEventButton.classList.add("one-event-button");
    addEventButton.textContent = "Add Event";

    allChanceText.classList.add("all-events-success-text");
    allChanceText.textContent = "All succeed: ...%";
    selectedChanceText.classList.add("selected-success-text");
    selectedChanceText.textContent = "Selected succeed: ...%";
    selctedWithAllChanceText.classList.add("selected-success-and-fail-text");
    selctedWithAllChanceText.textContent = "Selected succeed and non-selected fail: ...%";

    topStuff.appendChild(eventCounterText);
    topStuff.appendChild(addMultipleEventsButton);
    topStuff.appendChild(storerName);
    topStuff.appendChild(clearAllButton);
    topStuff.appendChild(removeStorerButton);

    buttonPanel.appendChild(addEventButton);
    eventLevel.appendChild(buttonPanel);
    container.appendChild(eventLevel);

    chanceStuff.appendChild(allChanceText);
    chanceStuff.appendChild(selectedChanceText);
    chanceStuff.appendChild(selctedWithAllChanceText);

    newStorer.appendChild(seperatingLine1);
    newStorer.appendChild(topStuff);
    newStorer.appendChild(container);
    newStorer.appendChild(chanceStuff);
    newStorer.appendChild(seperatingLine2);

    assignStorerEventListeners(newStorer, addMultipleEventsButton, removeStorerButton, 
        clearAllButton, addEventButton);

    defineStorersElems(newStorer, container, allChanceText, selectedChanceText, 
        selctedWithAllChanceText, eventCounterText, buttonPanel);

    selectStorer(newStorer);
    document.getElementsByClassName("remove-storer-button")[0].disabled = false;

    //defineSelectorBoxListeners(container);

    document.body.appendChild(newStorer);
    document.body.appendChild(addStorerButton);
}


function defineNumberField(input, defaultValue, min) {
    input.classList.add("num-input");
    input.setAttribute("type", "number");
    input.value = defaultValue;
    if (min != NaN) {input.min = min;}
}

function defineAttackTypeSubArea(radio, label, area, value, text) {
    radio.setAttribute("type", "radio");
    radio.setAttribute("value", value);
    radio.setAttribute("name", "attacktype" + DNDEvent.eventsCreated);
    radio.id = text + DNDEvent.eventsCreated;
    label.setAttribute("for", radio.id);
    label.textContent = text;
    area.classList.add("attack-type-area");
    area.appendChild(radio);
    area.appendChild(label);
}

function defineArea(area, text, input) {
    defineEventText(area, text)
    area.appendChild(input);
}

function defineEventText(area, text) {
    area.classList.add("inside-dndevent");
    area.textContent = text;
}

function addToParent(parent, parentClass, ...children) {
    parent.classList.add(parentClass);
    for (const child of children) {parent.appendChild(child);}
}

function changeContainerHeight(pixels, theStorer) {
    const ogHeight = theStorer.container.style.height;
    theStorer.container.style.height = BigInt(ogHeight.substring(0, ogHeight.length - 2)) + pixels + "px";
}

function defineSelectedTexts(theStorer) {
    theStorer.successfulEventsText.textContent = "Selected succeed: " + (theStorer.chanceSelected() * 100 || "...") + "%";
    theStorer.successWithFailEventsText.textContent = "Selected succeed and non-selected fail: " + (theStorer.chanceSelectedWithAll() * 100 || "...") + "%";
}

function defineAllBottomChanceTexts(theStorer) {
    theStorer.allSuccessesText.textContent = "All succeed: " + ((theStorer.chanceAll() * 100) || "...") + "%";
    defineSelectedTexts(theStorer);
}

function addEventListenerToDNDEventComponent(addingTo, trigger, event, chanceText, setterFunc, theStorer) {
    addingTo.addEventListener(trigger, function () {
        const newValue = BigInt(addingTo.value);
        const prevChance = event.chanceToHit();
        setterFunc.call(event, newValue);
        theStorer.accountForChangedEvent(prevChance, event);
        chanceText.textContent = (event.chanceToHit() * 100) + "%";
        defineAllBottomChanceTexts(theStorer);
    });
}

function replaceEventStyleClass(event, newClass) {
    event.classList.replace(event.classList.item(0), newClass);
}

function removeDNDEventFromScreen(event, theStorer) {
    const allChildren = theStorer.container.children;

    event.remove();
    theStorer.removeDNDEvent(event.index);
    theStorer.counterText.textContent = "Events: " + theStorer.eventCounter;

    defineAllBottomChanceTexts(theStorer);

    for (var i = Math.trunc(event.index / theStorer.maxElementsPerRow) + 1; i < allChildren.length; i++) {
        allChildren[i - 1].appendChild(allChildren[i].children[0]);
    }
    if (allChildren[allChildren.length - 1].children.length == 0) {
        changeContainerHeight(-190n, theStorer);
        allChildren[allChildren.length - 1].remove(); //removes the now empty row that would store DNDEvents
    }
}

function addDNDEventToScreen(theStorer) {
    const event = new DNDEvent(theStorer);
    const acArea = document.createElement("div");
    const modsArea = document.createElement("div");
    const attackTypeText = document.createElement("div");
    const attackTypeArea = document.createElement("div");
    const flatArea = document.createElement("div");
    const advArea = document.createElement("div");
    const disArea = document.createElement("div");
    const acInput = document.createElement("input");
    const modsInput = document.createElement("input");
    const flatRadio = document.createElement("input");
    const advRadio = document.createElement("input");
    const disRadio = document.createElement("input");
    const flatLabel = document.createElement("label");
    const advLabel = document.createElement("label");
    const disLabel = document.createElement("label");
    const chanceText = document.createElement("p");
    const removeButton = document.createElement("button");
    const allChildren = theStorer.container.children;
    const selectedLevel = allChildren[allChildren.length - 1];

    defineNumberField(acInput, event.ac, 1n);
    defineNumberField(modsInput, event.mods, NaN);
    addEventListenerToDNDEventComponent(acInput, "input", event, chanceText, event.copySetterAC, theStorer);
    addEventListenerToDNDEventComponent(modsInput, "input", event, chanceText, event.copySetterMods, theStorer);

    defineAttackTypeSubArea(flatRadio, flatLabel, flatArea, 0, "Flat");
    flatRadio.setAttribute("checked", "");
    defineAttackTypeSubArea(advRadio, advLabel, advArea, 1, "Adv.");
    defineAttackTypeSubArea(disRadio, disLabel, disArea, 2, "Dis.");
    addEventListenerToDNDEventComponent(flatRadio, "change", event, chanceText, event.copySetterAttackType, theStorer);
    addEventListenerToDNDEventComponent(advRadio, "change", event, chanceText, event.copySetterAttackType, theStorer);
    addEventListenerToDNDEventComponent(disRadio, "change", event, chanceText, event.copySetterAttackType, theStorer);

    defineArea(acArea, "AC to hit: ", acInput);
    defineArea(modsArea, "Mods: ", modsInput);

    defineEventText(attackTypeText, "Attack Type:");
    defineEventText(chanceText, (event.chanceToHit() * 100) + "%");

    addToParent(attackTypeArea, "inside-dndevent", flatArea, advArea, disArea);

    addToParent(event, "dndevent-panel-normal", acArea, modsArea, attackTypeText, attackTypeArea, chanceText);

    theStorer.buttonPanel.remove();
    selectedLevel.appendChild(event);

    if (theStorer.eventCounter > 0 && (theStorer.eventCounter + 1) % theStorer.maxElementsPerRow == 0) {
        changeContainerHeight(190n, theStorer);

        const newLevel = document.createElement("div");
        newLevel.classList.add("event-level");
        newLevel.appendChild(theStorer.buttonPanel);
        theStorer.container.appendChild(newLevel);
    }
    else {selectedLevel.appendChild(theStorer.buttonPanel);}

    theStorer.addDNDEvent(event);
    defineAllBottomChanceTexts(theStorer);

    //fix text-centering issues w/ the events' remove buttons
    removeButton.style.position = "relative";
    removeButton.style.height = "20px";
    removeButton.style.width = "20px";
    removeButton.textContent = "X";
    removeButton.classList.add("remove-event-button");
    removeButton.addEventListener("click", function () {
        removeDNDEventFromScreen(event, theStorer);
    }, {once: true});

    event.addEventListener("mouseenter", function () { 
        if (!event.selected) {replaceEventStyleClass(event, "dndevent-panel-hover");}

        removeButton.style.left = "140px";
        removeButton.style.top = "-161px";
        event.appendChild(removeButton);
    });
    event.addEventListener("mouseleave", function () {
        if (!event.selected) {replaceEventStyleClass(event, "dndevent-panel-normal");}
        removeButton.remove();
    });
    event.addEventListener("click", function (event1) {
        if (!event1.shiftKey || event1.target.classList.contains("remove-event-button")) {return false;}

        event.selected = !event.selected;
        replaceEventStyleClass(event, (event.selected) ? "dndevent-panel-selected" : "dndevent-panel-hover");
        defineSelectedTexts(theStorer);
    });

    theStorer.counterText.textContent = "Events: " + theStorer.eventCounter;
}
