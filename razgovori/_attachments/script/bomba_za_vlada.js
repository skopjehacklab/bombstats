function направиРазговор(разговор) {
    var wrapper = $("<div>");

    var наслов = "Разговор помеѓу ";
    наслов += разговор.соговорници[0].име + " ";
    наслов += разговор.соговорници[0].презиме + " и ";
    наслов += разговор.соговорници[1].име + " ";
    наслов += разговор.соговорници[1].презиме;

    wrapper.append($("<h4>").text(наслов));

    разговор.содржина.forEach(function(линија) {
        wrapper.append($("<p>").text(линија)); 
    });
    return wrapper;
}

function направиБомба(doc) {
    var c = $("<div>").addClass("bomba");
    c.appendTo($("#container"));
    c.append($("<h2>").text("Бомба " + doc.бомба));

    var разговори = $("<div>").addClass("razgovori");
    разговори.appendTo(c);
    doc.разговори.forEach(function(разговор) {
        разговори.append(направиРазговор(разговор));
    });
}

jQuery(function($) {
    $Couch.view('all', {descending:true, include_docs:true}).done(
        function(data) {
            data.rows.sort(function(a, b) {
                return parseInt(a.doc.бомба) - parseInt(b.doc.бомба);
            });

            data.rows.forEach(function(row) {
                направиБомба(row.doc);
            });
        }
    );
});
