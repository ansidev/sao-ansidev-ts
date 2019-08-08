import path from 'path'
import test from 'ava'
import sao from 'sao'

const generator = path.join(__dirname, '..')

test('defaults', async t => {
  // In unit tests we skip prompts and use mocked answers instead
  // If not provided we will use the default value of the prompt
  const mockPromptAnswers = { useGitRepo: true }
  const stream = await sao.mock({ generator }, mockPromptAnswers)

  // Check if `router.js` is in the generated files
  t.true(stream.fileList.includes('package.json'))
})
