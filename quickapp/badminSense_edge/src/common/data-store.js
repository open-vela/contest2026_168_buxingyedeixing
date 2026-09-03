import storage from '@system.storage'
import { DEFAULT_SETTINGS, STORAGE_KEYS } from './constants'

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function getJson(key, fallback, callback) {
  storage.get({
    key,
    success(data) {
      if (!data) {
        callback(clone(fallback))
        return
      }
      try {
        callback(JSON.parse(data))
      } catch (error) {
        console.log('storage parse failed:', key)
        callback(clone(fallback))
      }
    },
    fail() {
      callback(clone(fallback))
    }
  })
}

function setJson(key, value, success, fail) {
  storage.set({
    key,
    value: JSON.stringify(value),
    success: success || function () {},
    fail: fail || function () { console.log('storage write failed:', key) }
  })
}

export default {
  loadSettings(callback) {
    getJson(STORAGE_KEYS.settings, DEFAULT_SETTINGS, (stored) => {
      callback(Object.assign({}, DEFAULT_SETTINGS, stored || {}))
    })
  },
  saveSettings(settings, success, fail) {
    setJson(STORAGE_KEYS.settings, settings, success, fail)
  },
  loadHistory(callback) {
    getJson(STORAGE_KEYS.history, [], (records) => {
      callback(Array.isArray(records) ? records : [])
    })
  },
  saveWorkout(record, success, fail) {
    this.loadHistory((history) => {
      const filtered = history.filter(item => item && item.id !== record.id)
      filtered.unshift(record)
      const next = filtered.slice(0, 50)
      setJson(STORAGE_KEYS.history, next, () => {
        setJson(STORAGE_KEYS.lastWorkout, record, success, fail)
      }, fail)
    })
  },
  loadLastWorkout(callback) {
    getJson(STORAGE_KEYS.lastWorkout, null, callback)
  },
  saveActive(record) {
    setJson(STORAGE_KEYS.activeWorkout, record)
  },
  loadActive(callback) {
    getJson(STORAGE_KEYS.activeWorkout, null, callback)
  },
  clearActive() {
    storage.delete({ key: STORAGE_KEYS.activeWorkout })
  }
}
