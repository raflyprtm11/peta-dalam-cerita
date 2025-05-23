let activeStream = null;

export function setActiveStream(stream) {
    if (activeStream) {
        activeStream.getTracks().forEach(t => t.stop());
    }
    activeStream = stream;
}
    
export function stopActiveStream() {
    if (activeStream) {
        activeStream.getTracks().forEach(t => t.stop());
        activeStream = null;
    }
}
