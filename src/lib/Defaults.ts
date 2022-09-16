export default class Defaults {

    public static SETTINGS = {
        selectAllText: false, // If true, selects all text when starting edit. Otherwise, selects last character.
        backgroundColor: 'white', // Colour of background overlay
        backgroundOpacity: 0.9, // Opacity of background overlay
        nodeLabel: 'name', // Which node.data() property holds the label
        showLogs: false, // Show debugging info in console
        zIndex: 1000, // zIndex of editing overlay
        pasteAsPlainText: true,
        maxTextWidth: 1000 // Maximum text width in pixels - if 'text-max-width'not specified
    };

    /**
     * Assigns default values for options that are not set
     * @param options 
     */
    public static assignDefaults(options: any): any {

        Object.keys(Defaults.SETTINGS).forEach(k => {
            if (!options[k]) {
                options[k] = Defaults.SETTINGS[k];
            }
        });
        return options;
    }
}