function(doc) {
    соговорници = [];
    if(doc.разговори && Array.isArray(doc.разговори)) {
        doc.разговори.forEach(function(разговор) {
            разговор.соговорници.forEach(function(соговорник) {
                    emit([соговорник.име, соговорник.презиме, соговорник.иницијали], разговор);
            });
        });
    }
}
