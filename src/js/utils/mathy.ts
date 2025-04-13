/**
 * @description Mathy
 * @author      C. M. de Picciotto <d3p1@d3p1.dev> (https://d3p1.dev/)
 */
import {V3} from '../types'

export default class Mathy {
  /**
   * Process square distance
   *
   * @param   {[number, number, number]} v1
   * @param   {[number, number, number]} v2
   * @returns {number}
   */
  static processSquareDistance(v1: V3, v2: V3): number {
    return (v2[0] - v1[0]) ** 2 + (v2[1] - v1[1]) ** 2 + (v2[2] - v1[2] ** 2)
  }
}
