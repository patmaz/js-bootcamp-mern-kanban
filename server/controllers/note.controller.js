import uuid from 'uuid/v4';
import Note from '../models/note';
import Lane from '../models/lane';

export function addNote(req, res) {
  if (!req.body.task) {
    res.status(403).end();
  }

  const newNote = new Note(req.body);

  newNote.id = uuid();

  newNote.save((err, saved) => {
    if (err) {
      res.status(500).send(err);
    }

    Lane.findOne({ id: req.params.laneId })
      .then(lane => {
        lane.notes.push(saved);
        return lane.save();
      })
      .then(() => {
        res.json(saved);
      });
  });
}

export function editNote(req, res) {
  if (!req.body.task) {
    res.status(403).end();
  }

  Note.findOneAndUpdate({ id: req.params.noteId }, req.body, (err, old) => {
    if (err) {
      res.status(500).send(err);
    }

    res.json({ old });
  });
}

export function deleteNote(req, res) {
  Note.findOne({ id: req.params.noteId }, (err, note) => {
    if (err) {
      res.status(500).end();
    }

    const mongoId = note._id;
    note.remove((err) => {
      if (err) {
        res.status(500).end();
      }

      Lane.findOne({ id: req.params.laneId })
        .then(lane => {
          lane.notes.remove(mongoId);
          lane.save();
        })
        .then(() => {
          res.json({ status: 'Note removed!' });
        });
    });
  });
}
