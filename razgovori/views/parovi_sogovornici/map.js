function(doc) {
    соговорници = [];
    if(doc.разговори && Array.isArray(doc.разговори)) {
        doc.разговори.forEach(function(разговор) {
            emit(разговор.соговорници, 1);
        });
    }
}
