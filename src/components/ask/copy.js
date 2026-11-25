/**
 * Ask journey copy and shared constants.
 *
 * Khmer is primary, English secondary. Every string is an inline { km, en }
 * object resolved through i18n `tl()` so a language switch re-renders copy and
 * existing answers without re-running the ask engine.
 */

export const ASK_MAX = 600
// The live character counter appears once the draft passes 480 characters, so
// it only surfaces as the reader approaches the 600-character limit.
export const ASK_COUNTER_AT = 480

export function cx(...parts) {
  return parts.filter(Boolean).join(' ')
}

export const ASK_COPY = {
  /* Page header ------------------------------------------------------- */
  eyebrow: { km: 'សួរ', en: 'ASK' },
  title: { km: 'សួរអំពីសុខភាពកូន', en: "Ask about your child's health" },
  lead: {
    km: 'ចម្លើយមកពីកំណត់ត្រាអប់រំតូចមួយដែលបានពិនិត្យ។ KOMA ផ្តល់ព័ត៌មានអប់រំតែប៉ុណ្ណោះ មិនធ្វើរោគវិនិច្ឆ័យ និងមិនណែនាំការព្យាបាលទេ។',
    en: 'Answers come from a small set of reviewed education notes. KOMA gives educational information only — it does not diagnose or recommend treatment.',
  },
  topicCount: { km: 'ប្រធានបទយោង', en: 'reference topics' },

  /* Empty state ------------------------------------------------------- */
  emptyPrompt: {
    km: 'សួស្តី! តើអ្នកចង់ដឹងអ្វី?',
    en: 'Hello — what would you like to know?',
  },
  emptyHint: {
    km: 'ចម្លើយមកពីប្រភពដែលបានពិនិត្យតែប៉ុណ្ណោះ។ KOMA មិនធ្វើរោគវិនិច្ឆ័យទេ។',
    en: 'Answers come only from reviewed sources. KOMA does not diagnose.',
  },
  suggestedLabel: {
    km: 'សំណួរដែលអ្នកអាចសួរ',
    en: 'Suggested questions',
  },

  /* Validation -------------------------------------------------------- */
  emptyError: { km: 'សូមវាយសំណួរ', en: 'Please type a question' },
  tooLong: {
    km: 'សំណួរវែងពេក (អតិបរមា ៦០០ តួអក្សរ)',
    en: 'Question too long (600 characters max)',
  },

  /* Answer states ----------------------------------------------------- */
  you: { km: 'អ្នក', en: 'You' },
  conversation: { km: 'ការសន្ទនា', en: 'Conversation' },
  answerLabel: { km: 'ចម្លើយ', en: 'Answer' },
  reviewedTag: {
    km: 'ផ្អែកលើប្រភពដែលបានពិនិត្យ',
    en: 'Reviewed source',
  },
  reading: { km: 'អាន...', en: 'reading…' },
  stopped: { km: 'បានឈប់', en: 'Stopped' },
  stoppedNote: {
    km: 'ចម្លើយត្រូវបានបញ្ឈប់មុនពេលបញ្ចប់។',
    en: 'The answer was stopped before it finished.',
  },
  followUpLabel: { km: 'សំណួរបន្ត', en: 'Follow-up questions' },

  /* Not covered ------------------------------------------------------- */
  notCoveredTitle: {
    km: 'ព័ត៌មានដែលមានមិនគ្របដណ្តប់សំណួរនេះទេ',
    en: 'The reviewed sources do not cover this question',
  },
  notCoveredTag: { km: 'មិនមានក្នុងប្រភព', en: 'Not in our sources' },
  notCoveredGuess: {
    km: 'KOMA មិនទាយចម្លើយទេ។ សូមសាកល្បងសំណួរខាងក្រោម ឬពិគ្រោះជាមួយបុគ្គលិកសុខភាព។',
    en: 'KOMA will not guess. Try one of the questions below, or speak with a health worker.',
  },
  safetyLink: { km: 'អានអំពីសុវត្ថិភាព', en: 'Read about safety' },

  /* Urgent ------------------------------------------------------------ */
  findFacility: {
    km: 'រកមើលមណ្ឌលសុខភាព',
    en: 'Find a health facility',
  },

  /* Composer ---------------------------------------------------------- */
  composerLabel: { km: 'សំណួររបស់អ្នក', en: 'Your question' },
  composerPlaceholder: {
    km: 'ឧ. តើខ្ញុំគួរថែទាំកូនពេលមានគ្រុនក្តៅដោយរបៀបណា?',
    en: 'e.g. How should I care for my child with a fever?',
  },
  send: { km: 'ផ្ញើ', en: 'Send' },
  sendAria: { km: 'ផ្ញើសំណួរ', en: 'Send question' },
  stop: { km: 'បញ្ឈប់', en: 'Stop' },
  stopAria: {
    km: 'បញ្ឈប់ការអានចម្លើយ',
    en: 'Stop reading the answer',
  },
  counterLabel: { km: 'តួអក្សរ', en: 'characters' },
  composerHint: {
    km: 'អតិបរមា ៦០០ តួអក្សរ។ សូមចុចប៊ូតុងផ្ញើ ដើម្បីផ្ញើសំណួរ។',
    en: 'Enter sends • Shift+Enter adds a line • 600 characters max',
  },

  /* Context rail ------------------------------------------------------ */
  railEyebrow: { km: 'បរិបទ', en: 'Context' },
  railTitle: { km: 'KOMA ឆ្លើយពីអ្វី', en: 'What KOMA answers from' },
  railNote: {
    km: 'ចម្លើយផ្អែកលើកំណត់ត្រាដែលបានពិនិត្យតែប៉ុណ្ណោះ មិនមែនការសន្ទនាពីមុនទេ។',
    en: 'Answers are grounded only in reviewed notes — not in chat history.',
  },
  answersFrom: { km: 'ចម្លើយមកពី', en: 'Answers come from' },
  recentTitle: { km: 'សំណួរថ្មីៗ', en: 'Recent questions' },
  recentEmpty: {
    km: 'មិនទាន់មានសំណួរថ្មីៗទេ។',
    en: 'No recent questions yet.',
  },
}
