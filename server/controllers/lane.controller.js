import Lane from '../models/lane';
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
      res.status(500).end();
    }

    lane.remove(() => {
      res.json({ status: 'Lane deleted!' });
    });
  });
}
