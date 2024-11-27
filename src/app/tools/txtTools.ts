export class txtTools {
  static parseMarkdown(rawMarkdown: string): string {
    return rawMarkdown
      .replace(/## (.+)/g, '<h2>$1</h2>') // Convert ## Headings to <h2>
      .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>') // Convert **bold** to <b>
      .replace(/\*(.+?)\*/g, '<i>$1</i>') // Convert *italic* to <i>
      .replace(/- (.+)/g, '<li>$1</li>') // Convert - list items to <li>
      .replace(/\n/g, '<br>'); // Replace newlines with <br>
  }
}
