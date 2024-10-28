import Func "mo:base/Func";

import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Text "mo:base/Text";

actor {
    // Define a type for translation entries
    type Translation = {
        original: Text;
        translated: Text;
        language: Text;
    };

    // Create a stable variable to store translations
    stable var translations : [Translation] = [];

    // Function to add a new translation
    public func addTranslation(original: Text, translated: Text, language: Text) : async () {
        let newTranslation : Translation = {
            original = original;
            translated = translated;
            language = language;
        };

        let buffer = Buffer.fromArray<Translation>(translations);
        buffer.add(newTranslation);
        translations := Buffer.toArray(buffer);
    };

    // Function to get translation history
    public query func getTranslationHistory() : async [Translation] {
        return Array.reverse(translations);
    };
}
