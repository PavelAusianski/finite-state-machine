class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if (config === undefined) {
            throw new Error();
        }
        this.initial = config.initial || {};
        this.actualState = config.initial || {};
        this.states = config.states || [];
        this.history = [];
        this.historyPointerIdx = -1;
        this.logHistory(this.initial);
    }
 
 
    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.actualState;
    }
 
    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if (!this.states.hasOwnProperty(state)) {
            throw new Error();
        } else {
            this.actualState = state;
            // this.prevState = this.actualState;
            this.logHistory(state);
        }
    }
 
    logHistory(state) {
        this.history = this.history.slice(0, this.historyPointerIdx + 1);
        this.history.push(state);
        this.historyPointerIdx = this.history.length - 1;
    }
 
    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        let curStateTransitions = this.states[this.getState()].transitions;
        if (curStateTransitions != undefined) {
            let nextState = curStateTransitions[event];
            if (nextState != undefined) {
                this.changeState(nextState);
            } else {
                throw new Error();
            }
        }
    }
 
    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.actualState = this.initial;
    }
 
    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        let stateKeys = Object.keys(this.states);
        if (event === undefined) {
            return stateKeys;
        } else {
            let resultStates = [];
            for (let stateKey in stateKeys) {
                if (stateKeys.hasOwnProperty(stateKey)) {
                    if (this.states[stateKeys[stateKey]].transitions.hasOwnProperty(event)) {
                        resultStates.push(stateKeys[stateKey]);
                    }
                }
            }
            return resultStates;
        }
    }
 
    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if (this.historyPointerIdx - 1 < 0) {
            return false;
        }
 
        this.actualState = this.history[--this.historyPointerIdx];
        return true;
    }
 
    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (this.historyPointerIdx + 1 >= this.history.length) {
            return false;
        }
 
        this.actualState = this.history[++this.historyPointerIdx];
        return true;
    }
 
    /**
     * Clears transition history
     */
    clearHistory() {
        this.history = [];
        this.historyPointerIdx = -1;
    }
}
 
module.exports = FSM;
 
/** @Created by Uladzimir Halushka **/