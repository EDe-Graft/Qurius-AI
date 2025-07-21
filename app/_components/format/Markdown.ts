// app/_components/format/markdownStyles.ts
export default function getMarkdownStyles(colors: any) {
  return {
    body: { color: colors.text, lineHeight: 24, fontSize: 14, fontFamily: 'Inter', marginBottom: 10 },
    strong: { color: colors.text, fontWeight: 'bold', fontSize: 16, lineHeight: 24 },
    em: { color: colors.text, fontStyle: 'italic', fontSize: 16, lineHeight: 24 },
    link: { color: colors.primary },
    list_item: { color: colors.text, fontSize: 16 },
    bullet_list: { marginBottom: 10 },
    ordered_list: { marginBottom: 10 },
    bullet_list_icon: { 
      color: colors.primary, 
      fontSize: 26, 
      fontWeight: 'bold',
      marginRight: 8,
      marginTop: 2
    },
    ordered_list_icon: { 
      color: colors.primary, 
      fontSize: 26, 
      fontWeight: 'bold',
      marginRight: 8,
      marginTop: 2
    },
    paragraph: { marginBottom: 16, lineHeight: 20, fontSize: 16, fontFamily: 'Inter' },
    image: { backgroundColor: colors.card, width: '100%', height: 200, resizeMode: 'contain', textDecorationColor: colors.text },
    heading1: { color: colors.text, fontSize: 20, fontWeight: 'bold', marginTop: 1, marginBottom: 8 },
    heading2: { color: colors.text, fontSize: 18, fontWeight: 'bold', marginTop: 1, marginBottom: 8 },
    heading3: { color: colors.text, fontSize: 16, fontWeight: 'bold', marginTop: 1, marginBottom: 8 },
    code_inline: {
      backgroundColor: colors.border,
      color: colors.text,
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderRadius: 4,
    },
    fence: {
      backgroundColor: colors.border,
      color: colors.text,
      padding: 16,
      borderRadius: 8,
      marginVertical: 10,
    },
    code_block: {
      backgroundColor: colors.border,
      color: colors.text,
      padding: 16,
      borderRadius: 8,
      marginVertical: 10,
    },
  };
}