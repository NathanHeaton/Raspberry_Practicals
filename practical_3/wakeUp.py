import smbus
bus = smbus.SMBus(1)

# Force wake from shutdown — write SpO2 mode directly
bus.write_i2c_block_data(0x57, 0x09, [0x03])
print("Wake command sent")

# Now check part ID
part_id = bus.read_byte_data(0x57, 0xFF)
print(f"Part ID: {hex(part_id)}")  # expect 0x15
