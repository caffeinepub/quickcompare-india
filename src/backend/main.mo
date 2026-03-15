import Text "mo:core/Text";

actor {
  public query ({ caller }) func getAppName() : async Text {
    "App Shell";
  };
};
