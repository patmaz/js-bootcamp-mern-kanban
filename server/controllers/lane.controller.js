import Lane from '../models/lane';
import Note from '../models/note';
import uuid from 'uuid/v4';

export function addLane(req, res) {
  if (!req.body.name) {
    res.status(403).end();
  }

  const newLane = new Lane(req.body);

  newLane.notes = [];

  newLane.id = uuid();

  newLane.save((err, saved) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ lane: saved });
  });
}

export function getLanes(req, res) {
  Lane.find().exec((err, lanes) => {
    if (err) {
      res.status(500).end();
    }
    res.json({ lanes });
  });
}

export function deleteLane(req, res) {
  Lane.findOne({ id: req.params.laneId }).exec((err, lane) => {
    if (err) {
      res.status(500).send(err);
    }

    lane.remove((err) => {
      if (err) {
        res.status(500).send(err);
      }

      lane.notes.forEach((noteId) => {
        Note.findByIdAndRemove({ _id: noteId }, (err) => {
          if (err) {
            res.status(500).send(err);
          }
        });
      });

      res.json({ status: `Lane ${req.params.laneId} and its notes deleted` });
    });
  });
}
