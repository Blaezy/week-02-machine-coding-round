import { LuMoon, LuSun } from 'react-icons/lu';
import Button from '../components/ui/Button.jsx';
import SegmentedControl from '../components/ui/SegmentedControl.jsx';
import Switch from '../components/ui/Switch.jsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { useSettings } from '../hooks/useSettings.js';
import { useTasks } from '../hooks/useTasks.js';

const themeOptions = [
  { value: 'light', label: 'Light', icon: <LuSun aria-hidden="true" className="size-3.5" /> },
  { value: 'dark', label: 'Dark', icon: <LuMoon aria-hidden="true" className="size-3.5" /> },
];

function Section({ title, children }) {
  return (
    <section aria-labelledby={`settings-${title}`} className="border-t border-line py-6 first:border-t-0 first:pt-0">
      <h2 id={`settings-${title}`} className="text-[13px] font-semibold text-muted">
        {title}
      </h2>
      <div className="mt-3 divide-y divide-line">{children}</div>
    </section>
  );
}

function Row({ id, label, description, children }) {
  return (
    <div className="flex items-center justify-between gap-6 py-3 first:pt-0 last:pb-0">
      <div className="min-w-0">
        <p id={id} className="text-sm font-medium">
          {label}
        </p>
        <p className="mt-0.5 text-[13px] text-muted">{description}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  useDocumentTitle('Settings');
  const { theme, setTheme, compactCards, setCompactCards } = useSettings();
  const { tasks, addSamples, clearCompleted, clearAll } = useTasks();
  const completedCount = tasks.filter((task) => task.status === 'completed').length;

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6 md:px-6 md:py-8">
      <h1 className="text-xl font-semibold tracking-tight">Settings</h1>
      <p className="mb-6 mt-0.5 text-sm text-muted">Appearance, board layout and your saved data.</p>

      <Section title="Appearance">
        <Row id="setting-theme" label="Theme" description="Dark is the default. Your choice is remembered.">
          <SegmentedControl
            name="theme"
            label="Theme"
            value={theme}
            onChange={setTheme}
            options={themeOptions}
            className="w-44"
          />
        </Row>
      </Section>

      <Section title="Board">
        <Row
          id="setting-compact"
          label="Compact cards"
          description="Hide descriptions to fit more tasks on screen."
        >
          <Switch checked={compactCards} onChange={setCompactCards} labelledBy="setting-compact" />
        </Row>
      </Section>

      <Section title="Data">
        <Row
          id="setting-samples"
          label="Sample tasks"
          description="Add a few example tasks to explore the board."
        >
          <Button onClick={addSamples}>Add samples</Button>
        </Row>
        <Row
          id="setting-completed"
          label="Completed tasks"
          description={`${completedCount} completed ${completedCount === 1 ? 'task' : 'tasks'}. You can undo this.`}
        >
          <Button onClick={clearCompleted} disabled={completedCount === 0}>
            Clear completed
          </Button>
        </Row>
        <Row
          id="setting-all"
          label="All tasks"
          description={`${tasks.length} ${tasks.length === 1 ? 'task' : 'tasks'} stored in this browser. You can undo this.`}
        >
          <Button variant="danger" onClick={clearAll} disabled={tasks.length === 0}>
            Delete all
          </Button>
        </Row>
      </Section>
    </div>
  );
}
