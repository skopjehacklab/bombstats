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

function ситеБомби($) {
    $Couch.view('all', {include_docs: true}).done(
        function(data) {
            data.rows.sort(function(a, b) {
                return parseInt(a.doc.бомба) - parseInt(b.doc.бомба);
            });

            data.rows.forEach(function(row) {
                направиБомба(row.doc);
            });
        }
    );
}

function ситеСоговорници($) {
    $Couch.view('sogovornici', {reduce: true, group: true}).done(
        function(data) {
            data.rows.sort(function(a, b) {
                return parseInt(b.value) - parseInt(a.value);
            });
            var табела = $("<table>").attr('cellspacing', '0').attr('cellpadding', '0');
            var наслови = $("<thead>");
            наслови.appendTo(табела);
            var насловиРед = $("<tr>");
            насловиРед.appendTo(наслови);
            насловиРед.append($("<td>").text("Иницијали"));
            насловиРед.append($("<td>").text("Име и презиме"));
            насловиРед.append($("<td>").text("Број на разговори"));
            var листа = $("<tbody>");
            листа.appendTo(табела);
            data.rows.forEach(function(row) {
                htmlRow = $("<tr>");
                htmlRow.append($("<td>").text(row.key[2]));
                htmlRow.append($("<td>").text(row.key[0] + " " + row.key[1]));
                htmlRow.append($("<td>").text(row.value));
                листа.append(htmlRow);
            });

            var наслов = $("<h2>").addClass("title").text("Сите учесници во објавените разговори");
            наслов.appendTo($("#container"));

            var c = $("<div>").addClass("bomba");
            c.appendTo($("#container"));
            c.append(табела);
    });
}

function паровиСоговорници($) {
    $Couch.view('parovi_sogovornici', {reduce: true, group: true}).done(
        function(data) {
            var aggr = {};
            data.rows.forEach(function(row) {
                if (aggr[row.key] || aggr[row.key.reverse()])
                    aggr[row.key].value += row.value;
                else
                    aggr[row.key] = row.value;
            });
            var табела = $("<table>").attr('cellspacing', '0').attr('cellpadding', '0');
            var наслови = $("<thead>");
            наслови.appendTo(табела);
            var насловиРед = $("<tr>");
            насловиРед.appendTo(наслови);
            насловиРед.append($("<td>").text("Соговорници"));
            насловиРед.append($("<td>").text("Број на разговори"));
            var листа = $("<tbody>");
            листа.appendTo(табела);
            for (key in aggr) {
                htmlRow = $("<tr>");
                htmlRow.append($("<td>").text(key[0][0] + " " + key[0][1] + " и " + key[1][0] + " " + key[1][1]));
                htmlRow.append($("<td>").text(aggr[key].value));
                листа.append(htmlRow);
            }

            var наслов = $("<h2>").addClass("title").text("Сите парови во објавените разговори");
            наслов.appendTo($("#container"));

            var c = $("<div>").addClass("bomba");
            c.appendTo($("#container"));
            c.append(табела);
    });
}

jQuery(function($) {
    паровиСоговорници($);
});
