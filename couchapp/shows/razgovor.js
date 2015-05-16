function(doc, req) {
    if (!doc) {
        return "Уште документот ти фали."
    }

    var датум = doc.бомба.датум.split("T")[0].replace(/-/g, ".");
    var соговорници = doc.соговорници[0].назив.join(" ") + " и " +
                      doc.соговорници[1].назив.join(" ");
    var ID = датум + "-" + doc.бомба.реден_број + "-" + doc.реден_број;
    var наслов = "<h1>" + ID + ": " + "Разговор помеѓу " + соговорници + "</h1>";

    var содржина = [];
    for (var i = 1; i != doc.содржина.length; i++) {
        var htmlId = ID + "-" + i;
        содржина.push("<a href='#" + htmlId + "'>" +
                      "<p id='" + htmlId + "'>" + doc.содржина[i] + "</p></a>");
    }

    return { body: наслов + содржина.join("\n") };
}
