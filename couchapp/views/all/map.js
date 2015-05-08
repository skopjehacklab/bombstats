function(doc) {
    if(doc.разговори && Array.isArray(doc.разговори)) {
        emit(null, doc);
    }
}