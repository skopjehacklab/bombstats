function(doc) {
    doc.соговорници.forEach(function(соговорник) {
        emit(соговорник.назив.concat(соговорник.иницијали), null);
    });
}
